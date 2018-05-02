/**
 * Authentication Default Entities
 */
import { injectable, interfaces } from 'inversify';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { containerManager } from '../ioc/container-manager';
import { TYPES } from '../types';
import { AuthProvider, AuthService, AuthUser, Principal, RoleMapping } from './auth-interfaces';

/**
 * Model for a user in the Authentication system.
 */
export class AuthUserModel implements AuthUser {
  public email: string;
  public hashedPassword: string;
}

/**
 * Model for a Role Mapping in the Authentication system.
 */
export class RoleMappingModel implements RoleMapping {
  public email: string;
  public roles: string[] = [];
}

/**
 * Model for a Principal of the Authentication system.
 */
export class PrincipalDefault implements Principal {
  public details: any;
  public errorCode: string;

  public isAuthenticated(): boolean {
    return this.details !== undefined && this.errorCode === undefined;
  }

  public isResourceOwner(resource: any): boolean {
    if (this.errorCode !== undefined || this.details === undefined || resource === undefined || resource.owner === undefined) {
      return false;
    }
    return resource.owner === this.details.sub;
  }

  public isInRole(role: string): boolean {
    if (this.errorCode !== undefined || this.details === undefined) {
      return false;
    }
    const authService: AuthService = this.getAuthService();
    if (!authService) {
      return false;
    }
    return authService.isInRole(this.details.sub, role);
  }

  private getContainer(): interfaces.Container {
    return containerManager.getContainer();
  }

  private getAuthService(): AuthService {
    try {
      return this.getContainer().get<AuthService>(TYPES.AuthService);
    } catch (err) {
      return undefined;
    }
  }
}

/**
 * In Memory basic Authentication Service.
 */
@injectable()
export class AuthServiceMemory implements AuthService {

  private users: Map<string, AuthUser> = new Map<string, AuthUser>();
  private roleMappings: Map<string, RoleMapping> = new Map<string, RoleMapping>();

  public newUser(user: AuthUser): AuthUser {
    if (this.existsUser(user.email)) {
      throw new Error(`User ${user.email} already exists.`);
    }
    const authUser: AuthUser = new AuthUserModel();
    authUser.email = user.email;
    authUser.hashedPassword = user.hashedPassword;
    this.users[authUser.email] = authUser;
    return authUser;
  }

  public updateUser(email: string, user: AuthUser): AuthUser {
    const authUser: AuthUser = this.findUser(email);
    if (authUser === undefined) {
      throw new Error(`User ${email} does not exists.`);
    }
    authUser.hashedPassword = user.hashedPassword;
    return authUser;
  }

  public existsUser(email: string): boolean {
    return this.findUser(email) !== undefined;
  }

  public removeUser(email: string): boolean {
    if (this.existsUser(email)) {
      delete this.users[email];
      return true;
    }
    return false;
  }

  public findUser(email: string): AuthUser {
    return this.users[email];
  }

  public authenticate(user: AuthUser): boolean {
    const authUser: AuthUser = this.findUser(user.email);
    return authUser && authUser.hashedPassword === user.hashedPassword;
  }

  public getRoleMapping(email: string): RoleMapping {
    return this.roleMappings[email];
  }

  public addRole(email: string, role: string): RoleMapping {
    let result: RoleMapping = this.roleMappings[email];
    if (!result) {
      result = new RoleMappingModel();
      result.email = email;
      this.roleMappings[email] = result;
    }
    if (result.roles.indexOf(role) === -1) {
      result.roles.push(role);
    }
    return result;
  }

  public removeRole(email: string, role: string): RoleMapping {
    const result: RoleMapping = this.roleMappings[email];
    if (!result) {
      return undefined;
    }
    const index: number = result.roles.indexOf(role);
    if (index !== -1) {
      result.roles.splice(index, 1);
    }
    return result;
  }

  public isInRole(email: string, role: string): boolean {
    const roleMapping: RoleMapping = this.getRoleMapping(email);
    if (!roleMapping || !roleMapping.roles || roleMapping.roles.length === 0) {
      return false;
    }
    return roleMapping.roles.indexOf(role) !== -1;
  }
}

/**
 * Basic Authentication Provider with JWT.
 */
@injectable()
export class AuthProviderDefault implements AuthProvider {
  public issuer: string;
  public audience: string;
  public secret: string;
  public expirationSpan: number;

  constructor() {
    this.issuer = 'defaultIssuer';
    this.audience = '*';
    this.secret = 'AuthProviderDefault*12345!';
    this.expirationSpan = 60 * 60;
  }

  public createAccessToken(user: AuthUser, scope: string = 'full_access'): string {
    const authService: AuthService = this.getAuthService();
    if (!authService.authenticate(user)) {
      throw new Error('Username/password combination invalid');
    }
    const roleMapping: RoleMapping = authService.getRoleMapping(user.email);
    const roles: string[] = roleMapping ? roleMapping.roles : [];
    const payload: any = {
      iss: this.issuer,
      aud: this.audience,
      exp: Math.floor(Date.now() / 1000) + this.expirationSpan,
      scope,
      sub: user.email,
      jti: this.getJti(),
      alg: 'HS256',
      roles
    };
    return jwt.sign(payload, this.secret);
  }

  public verifyToken(token: string): any {
    try {
      const payload: any = jwt.verify(token, this.secret);
      if (payload.iss !== this.issuer) {
        return undefined;
      }
      return payload;
    } catch (err) {
      return undefined;
    }
  }

  public getUser(req: any, res: any, next: Function): Principal {
    let token: string;
    if (req.headers && req.headers.authorization) {
      const parts: string[] = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme: string = parts[0];
        const credentials: string = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return this.getPrincipalError('credentials_bad_scheme');
        }
      } else {
        return this.getPrincipalError('credentials_bad_format');
      }
    }
    if (!token) {
      return this.getPrincipalError('credentials_required');
    }
    const payload: any = this.verifyToken(token);
    if (!payload) {
      return this.getPrincipalError('invalid_token');
    }
    const result: Principal = new PrincipalDefault();
    result.details = payload;
    result.errorCode = undefined;
    return result;
  }

  private getJti(): string {
    return uuid.v4();
  }

  private getContainer(): interfaces.Container {
    return containerManager.getContainer();
  }

  private getAuthService(): AuthService {
    return this.getContainer().get<AuthService>(TYPES.AuthService);
  }

  private getPrincipalError(errorCode: string): Principal {
    const result: Principal = new PrincipalDefault();
    result.details = undefined;
    result.errorCode = errorCode;
    return result;
  }
}

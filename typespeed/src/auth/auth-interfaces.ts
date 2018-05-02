/**
 * Authentication interfaces.
 */
export interface AuthUser {
  email: string;
  hashedPassword: string;
}

export interface Principal {
  details: any;
  errorCode: string;
  isAuthenticated(): boolean;
  isResourceOwner(resource: any): boolean;
  isInRole(role: string): boolean;
}

export interface RoleMapping {
  email: string;
  roles: string[];
}

export interface AuthProvider {
  createAccessToken(user: AuthUser, scope?: string): string;
  verifyToken(token: string): boolean;
  getUser(req: any, res: any, next: Function): Principal;
}

export interface AuthService {
  newUser(user: AuthUser): AuthUser;
  updateUser(email: string, user: AuthUser): AuthUser;
  existsUser(email: string): boolean;
  removeUser(email: string): boolean;
  findUser(email: string): AuthUser;
  authenticate(user: AuthUser): boolean;
  getRoleMapping(email: string): RoleMapping;
  addRole(email: string, role: string): RoleMapping;
  removeRole(email: string, role: string): RoleMapping;
  isInRole(email: string, role: string): boolean;
}

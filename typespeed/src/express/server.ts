/**
 * Module for the express server
 */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as helmet from 'helmet';
import * as inversify from 'inversify';
import "reflect-metadata";
import { AuthProviderDefault, AuthServiceMemory} from '../auth/auth-entities';
import { AuthProvider, AuthService, Principal } from '../auth/auth-interfaces';
import { containerManager } from '../ioc/container-manager';
import { TYPES } from '../types';
import { BaseMiddleware} from './base-middleware';
import { interfaces } from './interfaces';

/**
 * Class for the Express Server
 */
export class ExpressServer {

  public static defaultRoutingRootPath: string = '/';

  private container: inversify.interfaces.Container;
  private router: express.Router;
  private routingConfig: interfaces.RoutingConfig;
  private app: express.Application;
  private configFn: interfaces.ConfigFunction;
  private errorConfigFn: interfaces.ConfigFunction;
  private authProvider: { new(): AuthProvider } | undefined;
  private port: number|string;

  constructor(
    container?: inversify.interfaces.Container,
    customRouter?: express.Router | null,
    routingConfig?: interfaces.RoutingConfig | null,
    customApp?: express.Application | null,
    authProvider?: { new(): AuthProvider }
  ) {
    this.container = container || containerManager.getContainer();
    this.router = customRouter || express.Router();
    this.routingConfig = routingConfig || { rootPath: ExpressServer.defaultRoutingRootPath };
    this.app = customApp || express();
    this.authProvider = authProvider;
    if (authProvider) {
      this.container.bind<AuthProvider>(TYPES.AuthProvider).to(authProvider);
    }
    this.port = process.env.PORT || process.env.port || 3000;
  }

  public useDefaultAuth(): ExpressServer {
    this.container.bind<AuthService>(TYPES.AuthService).to(AuthServiceMemory).inSingletonScope();
    this.container.bind<AuthProvider>(TYPES.AuthProvider).to(AuthProviderDefault).inSingletonScope();
    return this;
  }

  public setConfig(fn: interfaces.ConfigFunction): ExpressServer {
    this.configFn = fn;
    return this;
  }

  public setErrorConfig(fn: interfaces.ConfigFunction): ExpressServer {
    this.errorConfigFn = fn;
    return this;
  }

  public setPort(port: number): ExpressServer {
    this.port = port;
    return this;
  }

  public build(): ExpressServer {
    this.app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      (async (): Promise<any> => {
        // tslint:disable-next-line no-floating-promises
        const httpContext: any = await this.createHttpContext(req, res, next);
        Reflect.defineMetadata(interfaces.METADATA_KEY.httpContext, httpContext, req);
        next();
      })();
    });
    if (this.configFn) {
      this.configFn.apply(undefined, [this.app]);
    } else {
      this.defaultConfigFn.apply(undefined, [this.app]);
    }
    this.registerControllers();
    if (this.errorConfigFn) {
      this.errorConfigFn.apply(undefined, [this.app]);
    }
    return this;
  }

  public start(): express.Application {
    this.app.listen(this.port);
    return this.app;
  }

  private async createHttpContext(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    const principal: Principal = await this.getCurrentUser(req, res, next);
    return { request: req, response: res, user: principal };
  }

  private async getCurrentUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<Principal> {
    const authProvider: AuthProvider = this.container.get<AuthProvider>(TYPES.AuthProvider);
    if (authProvider) {
      return await authProvider.getUser(req, res, next);
    } else {
      return Promise.resolve<Principal>({
        details: null,
        errorCode: undefined,
        isAuthenticated: (): any => Promise.resolve(false),
        isInRole: (role: string): any => Promise.resolve(false),
        isResourceOwner: (resource: any): any => Promise.resolve(false)
      });
    }
  }

  private registerControllers(): void {
    this.container.bind<interfaces.HttpContext>(TYPES.HttpContext).toConstantValue(<any>{});
    this.container.bind<Principal>(TYPES.Principal).toConstantValue(<any>{});
    const controllerMetadataList: interfaces.ControllerMetadata[] = Reflect.getMetadata(interfaces.METADATA_KEY.controller, Reflect) || [];
    controllerMetadataList.forEach((metadata: interfaces.ControllerMetadata) => {
      const targetConstructor: any = metadata.target;
      if (this.container.isBoundNamed(TYPES.Controller, metadata.target.name)) {
        throw new Error(`Two controllers cannot have the same name: ${metadata.target.name}`);
      }
      this.container.bind(TYPES.Controller).to(targetConstructor).whenTargetNamed(metadata.target.name);
    });
    let controllers: interfaces.Controller[];
    try {
      controllers = this.container.getAll<interfaces.Controller>(TYPES.Controller);
    } catch (ex) {
      return;
    }
    controllers.forEach((controller: interfaces.Controller) => {
      const controllerMetadata: interfaces.ControllerMetadata =
        Reflect.getMetadata(interfaces.METADATA_KEY.controller, controller.constructor);
      const methodMetadata: interfaces.ControllerMethodMetadata[] =
        Reflect.getOwnMetadata(interfaces.METADATA_KEY.controllerMethod, controller.constructor);
      const parameterMetadata: interfaces.ControllerParameterMetadata =
        Reflect.getOwnMetadata(interfaces.METADATA_KEY.controllerParameter, controller.constructor);
      if (controllerMetadata && methodMetadata) {
        const controllerMiddleware: any[] = this.resolveMiddleware(...controllerMetadata.middleware);
        methodMetadata.forEach((metadata: interfaces.ControllerMethodMetadata) => {
          let paramList: interfaces.ParameterMetadata[] = [];
          if (parameterMetadata) {
            paramList = parameterMetadata[metadata.key] || [];
          }
          const handler: any = express.RequestHandler = this.handlerFactory(controllerMetadata.target.name, metadata.key, paramList);
          const routeMiddleware: any[] = this.resolveMiddleware(...metadata.middleware);
          this.router[metadata.method](`${controllerMetadata.path}${metadata.path}`, ...controllerMiddleware, ...routeMiddleware, handler);
        });
      }
    });
    this.app.use(this.routingConfig.rootPath, this.router);
  }

  private resolveMiddleware(...middleware: interfaces.Middleware[]): express.RequestHandler[] {
    return middleware.map((middlewareItem: any) => {
      if (!this.container.isBound(middlewareItem)) {
        return <express.RequestHandler>middlewareItem;
      }
      const middlewareInstance: any = this.container.get<interfaces.MiddlewareInstance>(middlewareItem);
      if (!(middlewareInstance instanceof BaseMiddleware)) {
        return middlewareInstance;
      }
      return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        const httpContext: any = this.getHttpContext(req);
        (<any>middlewareInstance).httpContext = httpContext;
        middlewareInstance.handler(req, res, next);
      };
    });
  }

  private getHttpContext(req: express.Request): any {
    return Reflect.getOwnMetadata(interfaces.METADATA_KEY.httpContext, req);
  }

  private getController(controllerName: string): interfaces.Controller {
    let controllers: interfaces.Controller[];
    controllers = this.container.getAll<interfaces.Controller>(TYPES.Controller);
    for (const controller of controllers) {
      if (controller.constructor.name === controllerName) {
        return controller;
      }
    }
    return undefined;
  }

  private getMethodMetadata(controllerName: string, key: string): interfaces.ControllerMethodMetadata {
    const controller: interfaces.Controller = this.getController(controllerName);
    if (!controller) {
      throw new Error('Controller not found');
    }
    const methodMetadata: interfaces.ControllerMethodMetadata[] =
      Reflect.getOwnMetadata(interfaces.METADATA_KEY.controllerMethod, controller.constructor);
    for (const metadata of methodMetadata) {
      if (metadata.key === key) {
        return metadata;
      }
    }
    throw new Error('Method Metadata not found');
  }

  private someRole(rolesA: string[], rolesB: string[]): boolean {
    for (let i = 0; i < rolesB.length; i += 1) {
      if (rolesA.indexOf(rolesB[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  private handlerFactory(controllerName: any, key: string, parameterMetadata: interfaces.ParameterMetadata[]): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
      const args: any[] = this.extractParameters(req, res, next, parameterMetadata);
      (async (): Promise<any> => {
        // tslint:disable-next-line
        const childContainer = this.container.createChild();
        const httpContext: any = this.getHttpContext(req);
        childContainer.bind<interfaces.HttpContext>(TYPES.HttpContext).toConstantValue(httpContext);
        childContainer.bind<Principal>(TYPES.Principal).toConstantValue(httpContext.user);
        try {
          const methodMetadata: interfaces.ControllerMethodMetadata = this.getMethodMetadata(controllerName, key);
          if (!methodMetadata) {
            return res.status(500).send('Internal Error');
          }
          if (methodMetadata.roles && methodMetadata.roles.length > 0) {
            if (!httpContext.user.details || !this.someRole(methodMetadata.roles, httpContext.user.details.roles)) {
              return res.status(401).send('Not authorized');
            }
          }
        } catch (err) {
          return res.status(500).send('Internal Error');
        }
        const result: any = childContainer.getNamed<any>(TYPES.Controller, controllerName)[key](...args);
        Promise.resolve(result).then((value: any) => {
          if (!value) {
            res.status(404).send('Item not found');
            return;
          }
          if (!res.headersSent) {
            res.send(value);
          }
        }).catch(next);
      })();
    };
  }

  private getParam(source: any, paramType: string | null, name: string): any {
    const param: any = (paramType !== null) ? source[paramType] : source;
    return param[name] || this.checkQueryParam(paramType, param);
  }

  private checkQueryParam(paramType: string | null, param: any): any {
    return paramType === 'query' ? undefined : param;
  }

  private extractParameters(req: express.Request, res: express.Response, next: express.NextFunction,
                            params: interfaces.ParameterMetadata[]): any[] {
    const args: any = [];
    if (!params || !params.length) {
      return [req, res, next];
    }
    for (const item of params) {
      switch (item.parameterType) {
        case interfaces.PARAMETER_TYPE.REQUEST: args[item.index] = this.getParam(req, null, item.parameterName); break;
        case interfaces.PARAMETER_TYPE.NEXT: args[item.index] = next; break;
        case interfaces.PARAMETER_TYPE.PARAMS: args[item.index] = this.getParam(req, 'params', item.parameterName); break;
        case interfaces.PARAMETER_TYPE.QUERY: args[item.index] = this.getParam(req, 'query', item.parameterName); break;
        case interfaces.PARAMETER_TYPE.BODY: args[item.index] = this.getParam(req, 'body', item.parameterName); break;
        case interfaces.PARAMETER_TYPE.HEADERS: args[item.index] = this.getParam(req, 'headers', item.parameterName); break;
        case interfaces.PARAMETER_TYPE.COOKIES: args[item.index] = this.getParam(req, 'cookies', item.parameterName); break;
        default: args[item.index] = res;
      }
    }
    args.push(req, res, next);
    return args;
  }

  private defaultConfigFn(app: express.Application): void {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(helmet());
  }
}

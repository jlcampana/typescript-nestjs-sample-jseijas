/**
 * Express interfaces
 */
import * as express from 'express';
import { interfaces as inversifyInterfaces } from 'inversify';
import { Principal } from '../auth/auth-interfaces';
import { BaseMiddleware } from './base-middleware';

export namespace interfaces {

  export interface HttpContext {
    request: express.Request;
    response: express.Response;
    user: Principal;
  }

  export interface RoutingConfig {
    rootPath: string;
  }

  export type ConfigFunction = (app: express.Application) => void;

  export type Middleware = (inversifyInterfaces.ServiceIdentifier<any> | express.RequestHandler);

  export interface ControllerMetadata {
    path: string;
    middleware: Middleware[];
    target: any;
    roles: string[];
  }

  export interface ControllerMethodMetadata extends ControllerMetadata {
    method: string;
    key: string;
  }

  export enum PARAMETER_TYPE {
    REQUEST,
    RESPONSE,
    PARAMS,
    QUERY,
    BODY,
    HEADERS,
    COOKIES,
    NEXT
  }

  export interface ParameterMetadata {
  parameterName: string;
  index: number;
  parameterType: PARAMETER_TYPE;
  }

  export interface ControllerParameterMetadata {
    [methodName: string]: ParameterMetadata[];
  }

  // tslint:disable-next-line no-empty-interface
  export interface Controller {}

  export type MiddlewareInstance = express.RequestHandler | BaseMiddleware;

  export type HandlerDecorator = (target: any, key: string, value: any) => void;

  export const METADATA_KEY: any = {
    controller: 'decorator-express:controller',
    controllerMethod: 'decorator-express:controller-method',
    httpContext: 'decorator-express:httpcontext',
    httpUser: 'decorator-express:httpuser'
  };
}

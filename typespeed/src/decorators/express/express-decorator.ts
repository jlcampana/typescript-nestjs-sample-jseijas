/**
 * Decorators for express
 */
import { decorate, inject, injectable } from 'inversify';
import { interfaces } from '../../express/interfaces';
import { TYPES } from '../../types';

export const injectHttpContext: any = inject(TYPES.HttpContext);

export const injectHttpUser: any = inject(TYPES.Principal);

export function controller(path: string, roles: string[], ...middleware: interfaces.Middleware[]) : any {
  return (target: any): any => {
    const currentMetadata: interfaces.ControllerMetadata = { middleware, path, target, roles };
    decorate(injectable(), target);
    Reflect.defineMetadata(interfaces.METADATA_KEY.controller, currentMetadata, target);
    const previousMetadata: interfaces.ControllerMetadata[] = Reflect.getMetadata(interfaces.METADATA_KEY.controller, Reflect) || [];
    const newMetadata: interfaces.ControllerMetadata[] = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(interfaces.METADATA_KEY.controller, newMetadata, Reflect);
  };
}

export function httpMethod(method: string, path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return (target: any, key: string, value: any): any => {
    const metadata: interfaces.ControllerMethodMetadata = { key, method, middleware, path, target, roles };
    let metadataList: interfaces.ControllerMethodMetadata[] = [];
    if (Reflect.hasOwnMetadata(interfaces.METADATA_KEY.controllerMethod, target.constructor)) {
      metadataList = Reflect.getOwnMetadata(interfaces.METADATA_KEY.controllerMethod, target.constructor);
    } else {
      Reflect.defineMetadata(interfaces.METADATA_KEY.controllerMethod, metadataList, target.constructor);
    }
    metadataList.push(metadata);
  };
}

export function all(path: string, roles: string[], ...middleware: interfaces.Middleware[]) : interfaces.HandlerDecorator {
  return httpMethod('all', path, roles, ...middleware);
}

export function httpGet(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('get', path, roles, ...middleware);
}

export function httpPost(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('post', path, roles, ...middleware);
}

export function httpPut(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('put', path, roles, ...middleware);
}

export function httpPatch(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('patch', path, roles, ...middleware);
}

export function httpHead(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('head', path, roles, ...middleware);
}

export function httpDelete(path: string, roles: string[], ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return httpMethod('delete', path, roles, ...middleware);
}

export function params(parameterType: interfaces.PARAMETER_TYPE, parameterName: string): any {
  return (target: Object, methodName: string, index: number): any => {
    let metadataList: interfaces.ControllerParameterMetadata = {};
    let parameterMetadataList: interfaces.ParameterMetadata[] = [];
    const parameterMetadata: interfaces.ParameterMetadata = { index, parameterName, parameterType };
    if (Reflect.hasOwnMetadata(interfaces.METADATA_KEY.controllerParameter, target.constructor)) {
      metadataList = Reflect.getOwnMetadata(interfaces.METADATA_KEY.controllerParameter, target.constructor);
      if (metadataList.hasOwnProperty(methodName)) {
        parameterMetadataList = metadataList[methodName];
      }
      parameterMetadataList.unshift(parameterMetadata);
    } else {
      parameterMetadataList.unshift(parameterMetadata);
    }
    metadataList[methodName] = parameterMetadataList;
    Reflect.defineMetadata(interfaces.METADATA_KEY.controllerParameter, metadataList, target.constructor);
  };
}

function paramDecoratorFactory(parameterType: interfaces.PARAMETER_TYPE): (name?: string) => ParameterDecorator {
  return (name?: string): ParameterDecorator => {
    return params(parameterType, name || 'default');
  };
}

export const request: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.REQUEST);
export const response: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.RESPONSE);
export const requestParam: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.PARAMS);
export const queryParam: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.QUERY);
export const requestBody: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.BODY);
export const requestHeaders: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.HEADERS);
export const cookies: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.COOKIES);
export const next: ParameterDecorator = paramDecoratorFactory(interfaces.PARAMETER_TYPE.NEXT);

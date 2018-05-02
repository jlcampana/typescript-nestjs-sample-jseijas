/**
 * Log decorator
 */
import * as inversify from 'inversify';
import { containerManager } from '../../ioc/container-manager';
import { Log } from '../../logger/log';
import { TYPES } from '../../types';
import { DecoratorHelper } from '../decorator-helper';
import { LogDecoratorConfiguration } from './log-decorator-configuration';

/**
 * Type of message hooked.
 */
enum MessageType {
  Enter,
  Exit,
  Exception
}

/**
 * Class for a Log Decorator
 */
class LogDecorator {
  public static getTime(): string {
    return (new Date()).toLocaleString().replace(',', '');
  }

  public static getLogFunction(messageType: MessageType): Function {
    const container: inversify.interfaces.Container = containerManager.getContainer();
    let logger: Log;
    if (container) {
      try {
        logger = container.get<Log>(TYPES.Log);
      } catch (err) {
        logger = undefined;
      }
    }
    if (!logger) {
      switch (messageType) {
        case MessageType.Enter: return console.info;
        case MessageType.Exit: return console.info;
        case MessageType.Exception: return console.warn;
        default: return console.debug;
      }
    } else {
      switch (messageType) {
        case MessageType.Enter: return logger.info.bind(logger);
        case MessageType.Exit: return logger.info.bind(logger);
        case MessageType.Exception: return logger.warn.bind(logger);
        default: return logger.debug.bind(logger);
      }
    }
  }

  public static logMessage(messageType: MessageType, message: string, instance: any, className: string,
                           methodName: string, method: Function, args: any[], options: any, result: any, exception: any): void {
    const timeStr: string = options.includeTime ? LogDecorator.getTime() : '';
    const classNameStr: string = className ? `${className}` : '';
    const logFunction: Function = LogDecorator.getLogFunction(messageType);
    logFunction(`[${timeStr} ${classNameStr}.${methodName}] ${message}`);
    if (options.includeArgs) {
      const argsStr: string[] = DecoratorHelper.getArguments(args, method, options);
      if (messageType === MessageType.Exit) {
        argsStr.push(`[return=${result}]`);
      }
      logFunction(`\tFunction arguments:\t${argsStr.join(' ')}`);
    }
    if (options.includeProperties) {
      const propsStr: string[] = DecoratorHelper.getProperties(method);
      logFunction(`\tClass properties:\t${propsStr.join(' ')}`);
    }
    if (messageType === MessageType.Exception) {
      logFunction(exception);
    }
  }

  public static preLog(self: any, className: string, methodName: string, method: Function, args: any, options: any): void {
    LogDecorator.logMessage(MessageType.Enter, 'Enter method', self, className, methodName, method, args, options, null, null);
  }

  public static postLog(self: any, className: string, methodName: string, method: Function, args: any, options: any, result: any): void {
    LogDecorator.logMessage(MessageType.Exit, 'Exit method', self, className, methodName, method, args, options, result, null);
  }

  public static catchLog(self: any, className: string, methodName: string, method: Function, args: any, options: any, ex: any): void {
    LogDecorator.logMessage(MessageType.Exception, 'Exception at method', self, className, methodName, method, args, options, null, ex);
  }
}

export const logDecoratorConfiguration: LogDecoratorConfiguration = new LogDecoratorConfiguration();

export function logClass(target?: any): any {
  let logOptions: any;
  if (typeof target === 'function') {
    logOptions = logDecoratorConfiguration.getConfiguration();
    return DecoratorHelper.decorateAllMethods(target, logOptions, LogDecorator.preLog, LogDecorator.postLog, LogDecorator.catchLog);
  }
  if (typeof target === 'string') {
    logOptions = logDecoratorConfiguration.getConfiguration(target);
  } else if (target === undefined) {
    logOptions = logDecoratorConfiguration.getConfiguration();
  } else {
    logOptions = target;
  }
  return (t: any): any => DecoratorHelper.decorateAllMethods(
    t, logOptions, LogDecorator.preLog, LogDecorator.postLog, LogDecorator.catchLog);
}

export function logMethod(target: any, key: string, descriptor: any) : any {
  const logOptions: any = logDecoratorConfiguration.getConfiguration();
  descriptor.value = DecoratorHelper.decorateMethod(target.constructor.name, key, descriptor.value, logOptions, LogDecorator.preLog,
                                                    LogDecorator.postLog, LogDecorator.catchLog);
}

/**
 * Class for a Decorator Helper.
 * Static class with methods that help in the decoration process of a class or method.
 */
export class DecoratorHelper {
  public static stripComments: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  public static argumentNames: RegExp = /([^\s,]+)/g;

  /**
   * Decorates a method.
   * @param className Name of the class.
   * @param methodName Name of the method.
   * @param method Descriptor of the method.
   * @param options Options of the decoration.
   * @param preMethod Function to be executed at the start of the method.
   * @param postMethod Function to be executed at the end of the method.
   * @param catchMethod Function to be executed if the method raises an exception.
   */
  public static decorateMethod(className: string, methodName: string, method: any, options: any,
                               preMethod: Function, postMethod: Function, catchMethod: Function): any {
    if (catchMethod) {
      if (preMethod && postMethod) {
        return function(...args: any[]): any {
          try {
            preMethod(this, className, methodName, method, args, options);
            const result: any = method.apply(this, args);
            postMethod(this, className, methodName, method, args, options, result);
            return result;
          } catch (ex) {
            catchMethod(this, className, methodName, method, args, options, ex);
            throw ex;
          }
        };
      } else if (preMethod) {
        return function(...args: any[]): any {
          try {
            preMethod(this, methodName, method, args, options);
            return method.apply(this, args);
          } catch (ex) {
            catchMethod(this, className, methodName, method, args, options, ex);
            throw ex;
          }
        };
      } else if (postMethod) {
        return function(...args: any[]): any {
          try {
            const result: any = method.apply(this, args);
            postMethod(this, className, methodName, method, args, options, result);
            return result;
          } catch (ex) {
            catchMethod(this, className, methodName, method, args, options, ex);
            throw ex;
          }
        };
      } else {
        return function(...args: any[]): any {
          try {
            return method.apply(this, args);
          } catch (ex) {
            catchMethod(this, className, methodName, method, args, options, ex);
            throw ex;
          }
        };
      }
    } else {
      if (preMethod && postMethod) {
        return function(...args: any[]): any {
          preMethod(this, className, methodName, method, args, options);
          const result: any = method.apply(this, args);
          postMethod(this, className, methodName, method, args, options, result);
          return result;
        };
      } else if (preMethod) {
        return function(...args: any[]): any {
          preMethod(this, className, methodName, method, args, options);
          return method.apply(this, args);
        };
      } else if (postMethod) {
        return function(...args: any[]): any {
          const result: any = method.apply(this, args);
          postMethod(this, className, methodName, method, args, options, result);
          return result;
        };
      } else {
        return method;
      }
    }
  }

  /**
   * Decorates a constructor of a class.
   * @param className Name of the class.
   * @param oldConstructor Old constructor descriptor.
   * @param args Arguments.
   * @param options Options for the decoration.
   * @param preMethod Function to be executed at the start of the method.
   * @param postMethod Function to be executed at the end of the method.
   * @param catchMethod Function to be executed if the method raises an exception.
   */
  public static getDecoratedConstructor(className: string, oldConstructor: any, args: any, options: any,
                                        preMethod: Function, postMethod: Function, catchMethod: Function): any {
    let newConstructor: any;
    if (catchMethod) {
      if (preMethod && postMethod) {
        newConstructor = function(): any {
          try {
            preMethod(this, className, 'constructor', oldConstructor, args, options);
            const result: any = new oldConstructor(args);
            postMethod(this, className, 'constructor', oldConstructor, args, options);
            return result;
          } catch (ex) {
            catchMethod(this, className, 'constructor', oldConstructor, args, options, ex);
            throw ex;
          }
        };
      } else if (preMethod) {
        newConstructor = function(): any {
          try {
            const result: any = new oldConstructor(args);
            postMethod(this, className, 'constructor', oldConstructor, args, options);
            return result;
          } catch (ex) {
            catchMethod(this, className, 'constructor', oldConstructor, args, options, ex);
            throw ex;
          }
        };
      } else if (postMethod) {
        newConstructor = function(): any {
          try {
            preMethod(this, className, 'constructor', oldConstructor, args, options);
            return new oldConstructor(args);
          } catch (ex) {
            catchMethod(this, className, 'constructor', oldConstructor, args, options, ex);
            throw ex;
          }
        };
      } else {
        newConstructor = function(): any {
          try {
            return new oldConstructor(args);
          } catch (ex) {
            catchMethod(this, className, 'constructor', oldConstructor, args, options, ex);
            throw ex;
          }
        };
      }
    } else {
      if (preMethod && postMethod) {
        newConstructor = function(): any {
          preMethod(this, className, 'constructor', oldConstructor, args, options);
          const result: any = new oldConstructor(args);
          postMethod(this, className, 'constructor', oldConstructor, args, options);
          return result;
        };
      } else if (preMethod) {
        newConstructor = function(): any {
          preMethod(this, className, 'constructor', oldConstructor, args, options);
          return new oldConstructor(args);
        };
      } else if (postMethod) {
        newConstructor = function(): any {
          const result: any = new oldConstructor(args);
          postMethod(this, className, 'constructor', oldConstructor, args, options);
          return result;
        };
      } else {
        return oldConstructor;
      }
    }
    newConstructor.prototype = oldConstructor.prototype;
    return new newConstructor();
  }

  /**
   * Decorates the constructor given the class.
   * @param target Target class.
   * @param options Options for the decoration.
   * @param preMethod Function to be executed at the start of the method.
   * @param postMethod Function to be executed at the end of the method.
   * @param catchMethod Function to be executed if the method raises an exception.
   */
  public static decorateConstructor(target: any, options: any, preMethod: Function, postMethod: Function, catchMethod: Function): any {
    const className: string = target.name;
    // tslint:disable-next-line no-function-expression
    const copyClass: any = function(...args: any[]): any {
      return DecoratorHelper.getDecoratedConstructor(className, target, args, options, preMethod, postMethod, catchMethod);
    };
    copyClass.prototype = target.prototype;
    return copyClass;
  }

  /**
   * Decorates all the methods of the target class.
   * @param target Target class.
   * @param options Options for the decoration.
   * @param preMethod Function to be executed at the start of the method.
   * @param postMethod Function to be executed at the end of the method.
   * @param catchMethod Function to be executed if the method raises an exception.
   */
  public static decorateAllMethods(target: any, options: any, preMethod: Function, postMethod: Function, catchMethod: Function): any {
    const className: string = target.name;
    const methodNames: string[] = Object.getOwnPropertyNames(target.prototype);
    methodNames.forEach((name: string) => {
      if (name !== 'constructor' && (!options.whiteList || options.whiteList.includes(name))) {
        if (!options.excludeList || !options.excludeList.includes(name)) {
          const method: any = target.prototype[name];
          target.prototype[name] = DecoratorHelper.decorateMethod(className, name, method, options, preMethod, postMethod, catchMethod);
        }
      }
    });
    if ((!options.whiteList || options.whiteList.includes('constructor')) &&
       (!options.excludeList || !options.excludeList.includes('constructor'))) {
      return DecoratorHelper.decorateConstructor(target, options, preMethod, postMethod, catchMethod);
    }
    return target;
  }

  /**
   * Gets the arguments names and values for a given function.
   * @param argValues Values for the arguments.
   * @param func Function to explore.
   * @param options Options.
   */
  public static getArguments(argValues: any[], func: Function, options: any) : string[] {
    const fnStr: string = func.toString().replace(DecoratorHelper.stripComments, '');
    const argNames: string[] | null = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(DecoratorHelper.argumentNames);
    if (argNames === null) {
      return [];
    }
    const result: string[] = [];
    for (let i : number = 0; i < argNames.length; i += 1) {
      result.push(`[${argNames[i]}=${argValues[i]}]`);
    }
    return result;
  }

  /**
   * Gets the property names and values of a given instance.
   * @param target Instance of a class.
   */
  public static getProperties(target: any) : string[] {
    const keys: string[] = Object.getOwnPropertyNames(target);
    const result: string[] = [];
    for (const key of keys) {
      result.push(`[${key}=${target[key]}]`);
    }
    return result;
  }
}

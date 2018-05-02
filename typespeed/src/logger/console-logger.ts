/**
 * Console Logger
 */
import { injectable } from 'inversify';
import { Logger } from './logger';

/**
 * Class for a logger into Console
 */
/* tslint:disable:no-console */
@injectable()
export class ConsoleLogger extends Logger {
  public trace(message: any): void {
    console.trace(message);
  }

  public debug(message: any): void {
    console.debug(message);
  }

  public info(message: any): void {
    console.info(message);
  }

  public warn(message: any): void {
    console.warn(message);
  }

  public error(message: any): void {
    console.error(message);
  }

  public fatal(message: any): void {
    console.error(message);
  }
}
/* tslint:enable:no-console */

/**
 * Pino Logger
 */
import { injectable } from 'inversify';
import * as pino from 'pino';
import { Logger } from './logger';

/**
 * Class for a Pino Logger.
 */
@injectable()
export class PinoLogger extends Logger {

  private logger : any;

  constructor() {
    super();
    const pretty: any = pino.pretty();
    pretty.pipe(process.stdout);
    this.logger = pino({ name: 'app', safe: true }, pretty);
  }

  public trace(message: any): void {
    this.logger.trace(message);
  }

  public debug(message: any): void {
    this.logger.debug(message);
  }

  public info(message: any): void {
    this.logger.info(message);
  }

  public warn(message: any): void {
    this.logger.warn(message);
  }

  public error(message: any): void {
    this.logger.error(message);
  }

  public fatal(message: any): void {
    this.logger.error(message);
  }
}

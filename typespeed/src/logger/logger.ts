/**
 * Log interface
 */
import { injectable } from 'inversify';
import { Log, LogLevel } from './log';

/**
 * Basic class for a Logger that implements the interface Log.
 */
@injectable()
export class Logger implements Log {
  public log(level: LogLevel, message: any) : void {
    switch (level) {
      case LogLevel.Trace:
        this.trace(message);
        break;
      case LogLevel.Debug:
        this.debug(message);
        break;
      case LogLevel.Info:
        this.info(message);
        break;
      case LogLevel.Warn:
        this.warn(message);
        break;
      case LogLevel.Error:
        this.error(message);
        break;
      case LogLevel.Fatal:
        this.fatal(message);
        break;
      default:
        this.debug(message);
    }
  }

  public trace(message: any): void {
    throw new Error('Not implemented');
  }

  public debug(message: any): void {
    throw new Error('Not implemented');
  }

  public info(message: any): void {
    throw new Error('Not implemented');
  }

  public warn(message: any): void {
    throw new Error('Not implemented');
  }

  public error(message: any): void {
    throw new Error('Not implemented');
  }

  public fatal(message: any): void {
    throw new Error('Not implemented');
  }
}

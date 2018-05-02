/**
 * Log interface
 */

export enum LogLevel {
  Fatal,
  Error,
  Warn,
  Info,
  Debug,
  Trace
}

export interface Log {
  log(level: LogLevel, message: any) : void;
  trace(message: any): void;
  debug(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
  fatal(message: any): void;
}

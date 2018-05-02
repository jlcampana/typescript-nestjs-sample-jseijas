/**
 * Base Middleware
 */
import * as express from 'express';
import { injectable } from 'inversify';
import { interfaces } from './interfaces';

/**
 * Base Middleware abstract class.
 */
@injectable()
export abstract class BaseMiddleware {
  protected readonly httpContext: interfaces.HttpContext;
  public abstract handler(req: express.Request, res: express.Response, next: express.NextFunction): void;
}

/**
 * Base Http Controller
 */
import { injectable } from 'inversify';
import { injectHttpContext } from '../decorators/express/express-decorator';
import { interfaces } from './interfaces';

/**
 * Base Http Controller class.
 */
@injectable()
export class BaseHttpController {
  @injectHttpContext protected readonly httpContext: interfaces.HttpContext;
}

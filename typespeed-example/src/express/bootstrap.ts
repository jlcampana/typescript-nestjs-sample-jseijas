/**
 * Bootstrap of the Express example
 */
import { Container, containerManager, makeLoggerMiddleware, Log, TYPES, PinoLogger } from 'typespeed';
import { UserService, PolicyService, APPTYPES, DataAccess } from './services/interfaces';
import { UserServiceOnline } from './services/user.service';
import { PolicyServiceOnline } from './services/policy.service';
//import { DataOnline as DataInstance } from './dal/data.online';
//import { DataOffline as DataInstance } from './dal/data.offline';
import { DataOrm as DataInstance } from './dal/data.orm';

export const container: Container = containerManager.getContainer();

const useMiddlewareLogger: boolean = false;

export function bootstrap(): void {
  if (useMiddlewareLogger) {
    const middlewareLogger: any = makeLoggerMiddleware();
    container.applyMiddleware(middlewareLogger);
  }
  container.bind<Log>(TYPES.Log).to(PinoLogger);
  container.bind<DataAccess>(APPTYPES.DataAccess).to(DataInstance).inSingletonScope();
  container.bind<UserService>(APPTYPES.UserService).to(UserServiceOnline).inSingletonScope();
  container.bind<PolicyService>(APPTYPES.PolicyService).to(PolicyServiceOnline).inSingletonScope();
}

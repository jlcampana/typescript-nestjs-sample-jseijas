/**
 * Mockups of the Express example
 */
import { AuthService, AuthProvider, Container, containerManager, Log, TYPES } from 'typespeed';

export const container: Container = containerManager.getContainer();

const useMiddlewareLogger: boolean = false;

export function mockup(): void {
  const logger: Log = container.get<Log>(TYPES.Log)
  const authService: AuthService = container.get<AuthService>(TYPES.AuthService);
  const authProvider: AuthProvider = container.get<AuthProvider>(TYPES.AuthProvider);
  authService.newUser({ email: 'jesus.seijas@axa-groupsolutions.com', hashedPassword: 'atitelovoyacontar' });
  authService.addRole('jesus.seijas@axa-groupsolutions.com', 'admin');
  const adminToken: string = authProvider.createAccessToken({ email: 'jesus.seijas@axa-groupsolutions.com', hashedPassword: 'atitelovoyacontar' });
  logger.info(`You should use this token to log as admin: ${adminToken}`);
  authService.newUser({ email: 'user@axa-groupsolutions.com', hashedPassword: 'atitelovoyacontar' });
  authService.addRole('user@axa-groupsolutions.com', 'user');
  const userToken: string = authProvider.createAccessToken({ email: 'user@axa-groupsolutions.com', hashedPassword: 'atitelovoyacontar' });
  logger.info(`You should use this token to log as user: ${userToken}`);
}

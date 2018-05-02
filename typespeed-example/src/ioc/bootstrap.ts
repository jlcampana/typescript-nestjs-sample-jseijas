/**
 * Bootstrap of the IoC example
 */
import { Container, containerManager, makeLoggerMiddleware } from 'typespeed';
import 'reflect-metadata';
import { BroadSword, Fighter, Katana, Shuriken, Stone } from './entities';
import { ThrowableWeapon, TYPES, Warrior, Weapon } from './interfaces';

export const container: Container = containerManager.getContainer();

export function bootstrap(): void {
  const logger: any = makeLoggerMiddleware();
  container.applyMiddleware(logger);
  container.bind<Weapon>(TYPES.Weapon).to(BroadSword);
  container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Stone);
  container.bind<Warrior>(TYPES.Warrior).to(Fighter);
}

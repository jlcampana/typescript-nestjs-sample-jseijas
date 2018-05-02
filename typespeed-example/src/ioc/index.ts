/**
 * Example of Inversion of Control
 */

import 'reflect-metadata';
import { bootstrap, container } from './bootstrap';
import { TYPES, Warrior } from './interfaces';

bootstrap();
const fighter: Warrior = container.get<Warrior>(TYPES.Warrior);
// tslint:disable
console.log(fighter.fight());
console.log(fighter.sneak());
// tslint:enable

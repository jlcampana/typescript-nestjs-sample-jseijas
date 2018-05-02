/**
 * Interfaces and types for the IoC Example.
 */
export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  shoot(): string;
}

export const TYPES: any = {
  Warrior: Symbol('Warrior'),
  Weapon: Symbol('Weapon'),
  ThrowableWeapon: Symbol('ThrowableWeapon')
};

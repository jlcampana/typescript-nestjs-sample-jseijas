/**
 * Entities for the IoC example
 */
import { inject, Component } from 'typespeed';
import { ThrowableWeapon, TYPES, Warrior, Weapon } from './interfaces';

/**
 * Class for a Katan
 */
@Component()
export class Katana implements Weapon {
  public hit(): string {
    return 'cut!';
  }
}

/**
 * Class for a BroadSword
 */
@Component()
export class BroadSword implements Weapon {
  public hit(): string {
    return 'slush!';
  }
}

/**
 * Class for a Shuriken
 */
@Component()
export class Shuriken implements ThrowableWeapon {
  public shoot(): string {
    return 'hit!';
  }
}

/**
 * Class for a Stone
 */
@Component()
export class Stone implements ThrowableWeapon {
  public shoot(): string {
    return 'ploc!';
  }
}

/**
 * Class for a fighter
 */
@Component()
export class Fighter implements Warrior {

  private weapon: Weapon;
  private throwableWeapon: ThrowableWeapon;

  public constructor(
    @inject(TYPES.Weapon) weapon: Weapon,
    @inject(TYPES.ThrowableWeapon) throwableWeapon: ThrowableWeapon
  ) {
    this.weapon = weapon;
    this.throwableWeapon = throwableWeapon;
  }

  public fight(): string { return this.weapon.hit(); }
  public sneak(): string { return this.throwableWeapon.shoot(); }
}

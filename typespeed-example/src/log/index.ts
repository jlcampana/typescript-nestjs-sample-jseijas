/**
 * Application to show how to log automatically a class.
 */
import 'reflect-metadata';
import { Container, containerManager, Log, logClass, logMethod, TYPES, PinoLogger } from 'typespeed';

@logClass
class Person {
  public name: string;
  public surname: string;

  constructor(name : string, surname : string) {
    this.name = name;
    this.surname = surname;
  }

  public study(a: number, b: number): number {
    if (a === 0) {
      throw new Error('a cannot be 0');
    }
    return a + b;
  }
}

class OtherPerson {
  public name: string;
  public surname: string;

  constructor(name : string, surname : string) {
    this.name = name;
    this.surname = surname;
  }

  //@logMethod
  public study(a: number, b: number): number {
    if (a === 0) {
      throw new Error('a cannot be 0');
    }
    return a + b;
  }
}



const container: Container = containerManager.getContainer();

container.bind<Log>(TYPES.Log).to(PinoLogger);

try {
  const person: Person = new Person('John', 'Smith');
  person.study(7, 2);
  person.study(0, 1);
} catch (err) {
  // eat it!
}

try {
  const person: OtherPerson = new OtherPerson('Alice', 'Cooper');
  person.study(7, 2);
  person.study(0, 1);
} catch (err) {
  // eat it!
}

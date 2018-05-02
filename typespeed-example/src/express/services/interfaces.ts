/**
 * Interfaces and types for the Express Example.
 */
export interface Service {
  getBy(fieldName: string, value: string): Promise<any[]>;
  getOneBy(fieldName: string, value: string): Promise<any>
}

export interface UserService extends Service {
}

export interface PolicyService extends Service {
}

export interface DataAccess {
  get(url: string, listName: string): Promise<any[]>;
}

export const APPTYPES: any = {
  UserService: Symbol('UserService'),
  PolicyService: Symbol('PolicyService'),
  DataAccess: Symbol('DataAccess')
};

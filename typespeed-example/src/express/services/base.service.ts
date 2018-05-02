/**
 * Entities for the express example.
 */
import { Component, inject } from 'typespeed';
import { APPTYPES, DataAccess, Service } from './interfaces';

@Component()
export class BaseService implements Service {
  @inject(APPTYPES.DataAccess) protected dataAccess: DataAccess;
  protected url: string;
  protected listName: string;
  
  public async getBy(fieldName: string, value: string): Promise<any[]> {
    return (await this.dataAccess.get(this.url, this.listName)).filter(x => x[fieldName] === value);
  }

  public async getOneBy(fieldName: string, value: string): Promise<any> {
    const filtered: any[] = await this.getBy(fieldName, value);
    return filtered && filtered.length > 0 ? filtered[0] : undefined;
  }
}

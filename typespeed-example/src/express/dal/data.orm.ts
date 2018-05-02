/**
 * Entities for the express example.
 */
import { createConnection, Connection } from 'typeorm';
import { Component } from 'typespeed';
import { DataAccess } from '../services/interfaces';

@Component()
export class DataOrm implements DataAccess {
  private connection: Connection;
  constructor() {
    createConnection().then(async connection => {
      this.connection = connection;
    });
  }

  public async get(url: string, listName: string): Promise<any[]> {
    const repoName: string = listName === 'clients' ? 'Client' : 'Policy';
    const items =  await this.connection.getRepository(repoName).find();
    return items.map(x => {
      x['id'] = x['srcId'];
      delete x['srcId'];
      return x;
    });
  }
}

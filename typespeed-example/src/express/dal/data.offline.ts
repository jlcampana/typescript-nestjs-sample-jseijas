/**
 * Entities for the express example.
 */
import { Component } from 'typespeed';
import { DataAccess } from '../services/interfaces';
import * as fs from 'fs';

@Component()
export class DataOffline implements DataAccess {
  private getFileName(url: string): string {
    switch(url) {
      case 'http://www.mocky.io/v2/5808862710000087232b75ac': return './src/express/mockups/clients.json';
      case 'http://www.mocky.io/v2/580891a4100000e8242b75c5': return './src/express/mockups/policies.json';
      default: return url;
    }
  }

  public async get(url: string, listName: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      try {
        const fileName: string = this.getFileName(url);
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            return reject(err);
          }
          const parsed: any = JSON.parse(data);
          if (listName) {
            return resolve(parsed[listName]);
          } 
          return resolve(parsed);
        });
      } catch(err) {
        return reject(err);
      }
    })
  }
}

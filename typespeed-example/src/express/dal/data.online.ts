/**
 * Entities for the express example.
 */
import { Component } from 'typespeed';
import { DataAccess } from '../services/interfaces';
import * as request from 'request-promise';

@Component()
export class DataOnline implements DataAccess {
  public async get(url: string, listName: string): Promise<any[]> {
    return (await request.get({ url: url, json: true }))[listName];
  }
}

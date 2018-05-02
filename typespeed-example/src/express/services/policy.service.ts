/**
 * Policy Service
 */
import { Component } from 'typespeed';
import { PolicyService } from './interfaces';
import { BaseService } from './base.service';

@Component()
export class PolicyServiceOnline extends BaseService implements PolicyService {
  constructor() {
    super();
    this.url = 'http://www.mocky.io/v2/580891a4100000e8242b75c5';
    this.listName = 'policies';
  }
}

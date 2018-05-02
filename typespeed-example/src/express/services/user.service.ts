/**
 * User Service
 */
import { Component } from 'typespeed';
import { UserService } from './interfaces';
import { BaseService } from './base.service';

@Component()
export class UserServiceOnline extends BaseService implements UserService {
  constructor() {
    super();
    this.url = 'http://www.mocky.io/v2/5808862710000087232b75ac';
    this.listName = 'clients';
  }
}

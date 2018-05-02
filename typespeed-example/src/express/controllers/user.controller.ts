/**
 * Users Controller
 */
import { Controller, Get, inject, Param } from 'typespeed';
import { UserService, APPTYPES } from '../services/interfaces';
import * as request from 'request-promise';

@Controller('/users')
export class UserController {
  @inject(APPTYPES.UserService) private userService: UserService;

  @Get('/:id', ['user', 'admin'])
  public async getById(@Param('id') id: string): Promise<any> {
    return this.userService.getOneBy('id', id);
  }

  @Get('/byname/:name', ['user', 'admin'])
  public async getByName(@Param('name') name: string): Promise<any> {
    return this.userService.getOneBy('name', name);
  }
}

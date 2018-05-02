/**
 * Policy Controller
 */
import { Controller, Get, inject, Param } from 'typespeed';
import { PolicyService, UserService, APPTYPES } from '../services/interfaces';

@Controller('/policies')
export class PolicyController {
  @inject(APPTYPES.UserService) private userService: UserService;
  @inject(APPTYPES.PolicyService) private policyService: PolicyService;

  @Get('/byusername/:name', ['admin'])
  public async getPoliciesByUserName(@Param('name') name: string): Promise<any[]> {
    const user = await this.userService.getOneBy('name', name);
    if (!user) {
      return undefined;
    }
    return this.policyService.getBy('clientId', user['id']);
  }

  @Get('/:id/user', ['admin'])
  public async getUserByPolicyId(@Param('id') id: string): Promise<any> {
    const policy = await this.policyService.getOneBy('id', id);
    if (!policy) {
      return undefined;
    }
    return this.userService.getOneBy('id', policy['clientId']);
  }
}

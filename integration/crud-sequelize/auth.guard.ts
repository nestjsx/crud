import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UsersService } from './users/users.service';
import { USER_REQUEST_KEY } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    req[USER_REQUEST_KEY] = await this.usersService.findOne({ where: { id: 1 } });

    return true;
  }
}

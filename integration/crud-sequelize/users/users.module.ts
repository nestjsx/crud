import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './user.model';
import { UserProfile } from '../users-profiles/userprofile.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MeController } from './me.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, UserProfile])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, MeController],
})
export class UsersModule {}

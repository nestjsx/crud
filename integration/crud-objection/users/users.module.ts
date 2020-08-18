import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MeController } from './me.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, MeController],
})
export class UsersModule {}

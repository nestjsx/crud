import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScheme } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'User', schema: UserScheme}],
    ),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

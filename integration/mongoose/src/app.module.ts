import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://aprova:aprova500kk@ec2-18-228-188-161.sa-east-1.compute.amazonaws.com:27017/next-qa?readPreference=primary&authSource=admin'
    ),
    UsersModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { withCache } from './orm.config';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(withCache), CompaniesModule, UsersModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrudModule } from '@nestjsx/crud';

CrudModule.loadConfig({
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
});

import { withCache } from './orm.config';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(withCache), CrudModule.forRoot(), CompaniesModule, UsersModule],
})
export class AppModule {}

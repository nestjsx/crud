import { Module } from '@nestjs/common';

import { CompaniesModule } from './companies/companies.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CompaniesModule,
    ProjectsModule,
    UsersModule
  ],
})
export class AppModule {}

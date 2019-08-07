import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    CompaniesModule,
    ProjectsModule,
    UsersModule,
  ],
})
export class AppModule {}

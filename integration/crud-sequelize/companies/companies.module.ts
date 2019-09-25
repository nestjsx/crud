import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CompaniesController } from './companies.controller';
import { companiesProviders } from './companies.providers';
import { CompaniesService } from './companies.service';

@Module({
  imports: [DatabaseModule],
  providers: [CompaniesService, ...companiesProviders],
  exports: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}

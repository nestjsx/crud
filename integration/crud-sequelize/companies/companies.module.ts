import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Company } from './company.model';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [SequelizeModule.forFeature([Company])],
  providers: [CompaniesService],
  exports: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}

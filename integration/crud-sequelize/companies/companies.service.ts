import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import { Company } from './company.model';

@Injectable()
export class CompaniesService extends SequelizeCrudService<Company> {
  constructor(@InjectModel(Company) private readonly company) {
    super(company);
  }
}

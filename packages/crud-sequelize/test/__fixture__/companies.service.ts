import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SequelizeCrudService } from '../../../crud-sequelize/src/sequelize-crud.service';
import { Company } from '../../../../integration/crud-sequelize/companies/company.model';

@Injectable()
export class CompaniesService extends SequelizeCrudService<Company> {
  constructor(@InjectModel(Company) company) {
    super(company);
  }
}

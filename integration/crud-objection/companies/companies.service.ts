import { Inject, Injectable } from '@nestjs/common';

import { Company } from './company.model';
import { ModelClass } from 'objection';
import { ObjectionCrudService } from '@nestjsx/crud-objection';

@Injectable()
export class CompaniesService extends ObjectionCrudService<Company> {
  constructor(@Inject('Company') modelClass: ModelClass<Company>) {
    super(modelClass);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ObjectionCrudService } from '../../../crud-objection/src/objection-crud.service';
import { Company } from '../../../../integration/crud-objection/companies';
import { ModelClass } from 'objection';

@Injectable()
export class CompaniesService extends ObjectionCrudService<Company> {
  constructor(@Inject('Company') modelClass: ModelClass<Company>) {
    super(modelClass);
  }
}

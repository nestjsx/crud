import { Inject, Injectable } from '@nestjs/common';

import { ObjectionCrudService } from '@nestjsx/crud-objection';
import { ModelClass } from 'objection';
import { UserProject } from './user-project.model';

@Injectable()
export class UserProjectsService extends ObjectionCrudService<UserProject> {
  constructor(@Inject('UserProject') modelClass: ModelClass<UserProject>) {
    super(modelClass);
  }
}

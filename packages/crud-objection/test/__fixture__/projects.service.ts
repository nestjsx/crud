import { Inject, Injectable } from '@nestjs/common';

import { ObjectionCrudService } from '../../../crud-objection/src/objection-crud.service';
import { Project } from '../../../../integration/crud-objection/projects';
import { ModelClass } from 'objection';

@Injectable()
export class ProjectsService extends ObjectionCrudService<Project> {
  constructor(@Inject('Project') modelClass: ModelClass<Project>) {
    super(modelClass);
  }
}

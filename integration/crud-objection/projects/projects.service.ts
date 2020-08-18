import { Inject, Injectable } from '@nestjs/common';

import { Project } from './project.model';
import { ObjectionCrudService } from '@nestjsx/crud-objection';
import { ModelClass } from 'objection';

@Injectable()
export class ProjectsService extends ObjectionCrudService<Project> {
  constructor(@Inject('Project') modelClass: ModelClass<Project>) {
    super(modelClass);
  }
}

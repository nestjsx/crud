import { Inject, Injectable } from '@nestjs/common';

import Project from '../../../../integration/crud-sequelize/projects/project.model';
import { SequelizeCrudService } from '../../src';

@Injectable()
export class ProjectsService extends SequelizeCrudService<Project> {
  constructor(
    @Inject('ProjectsRepository')
    private readonly repo: Project & typeof Project,
  ) {
    super(repo);
  }
}

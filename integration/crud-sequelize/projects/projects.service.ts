import { Inject, Injectable } from '@nestjs/common';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import Project from './project.model';

@Injectable()
export class ProjectsService extends SequelizeCrudService<Project> {
  constructor(
    @Inject('ProjectsRepository')
    private readonly projectsRepository: Project & typeof Project
  ) {
    super(projectsRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import { Project } from './project.model';

@Injectable()
export class ProjectsService extends SequelizeCrudService<Project> {
  constructor(@InjectModel(Project) repo) {
    super(repo);
  }
}

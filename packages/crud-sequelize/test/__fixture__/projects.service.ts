import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SequelizeCrudService } from '../../src';
import { Project } from '../../../../integration/crud-sequelize/projects/project.model';

@Injectable()
export class ProjectsService extends SequelizeCrudService<Project> {
  constructor(@InjectModel(Project) project) {
    super(project);
  }
}

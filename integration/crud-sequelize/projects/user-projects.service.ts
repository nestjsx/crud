import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import { UserProject } from './userproject.model';

@Injectable()
export class UserProjectsService extends SequelizeCrudService<UserProject> {
  constructor(@InjectModel(UserProject) repo) {
    super(repo);
  }
}

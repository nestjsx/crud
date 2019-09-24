import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Project } from "../../../../integration/crud-typeorm/projects";
import { TypeOrmCrudService } from "../../../crud-typeorm/src/typeorm-crud.service";

@Injectable()
export class ProjectsService extends TypeOrmCrudService<Project> {
  constructor(@InjectRepository(Project) repo) {
    super(repo);
  }
}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Project } from './project.model';
import { UserProject } from './userproject.model';
import { ProjectsService } from './projects.service';
import { UserProjectsService } from './user-projects.service';
import { ProjectsController } from './projects.controller';
import { MyProjectsController } from './my-projects.controller';

@Module({
  imports: [SequelizeModule.forFeature([Project, UserProject])],
  providers: [ProjectsService, UserProjectsService],
  exports: [ProjectsService, UserProjectsService],
  controllers: [ProjectsController, MyProjectsController],
})
export class ProjectsModule {}

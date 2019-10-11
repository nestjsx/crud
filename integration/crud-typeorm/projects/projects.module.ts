import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { UserProject } from './user-project.entity';
import { ProjectsService } from './projects.service';
import { UserProjectsService } from './user-projects.service';
import { ProjectsController } from './projects.controller';
import { MyProjectsController } from './my-projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, UserProject])],
  providers: [ProjectsService, UserProjectsService],
  exports: [ProjectsService, UserProjectsService],
  controllers: [ProjectsController, MyProjectsController],
})
export class ProjectsModule {}

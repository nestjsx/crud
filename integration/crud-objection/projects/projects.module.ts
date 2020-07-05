import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UserProjectsService } from './user-projects.service';
import { MyProjectsController } from './my-projects.controller';

@Module({
  providers: [ProjectsService, UserProjectsService],
  exports: [ProjectsService, UserProjectsService],
  controllers: [ProjectsController, MyProjectsController],
})
export class ProjectsModule {}

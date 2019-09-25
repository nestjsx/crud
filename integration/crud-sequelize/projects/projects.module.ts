import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { projectsProviders } from './project.providers';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectsService, ...projectsProviders],
  exports: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}

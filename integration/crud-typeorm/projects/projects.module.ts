import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectsService],
  exports: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}

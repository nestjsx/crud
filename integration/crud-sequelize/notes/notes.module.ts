import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Note } from './note.model';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [SequelizeModule.forFeature([Note])],
  providers: [NotesService],
  exports: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}

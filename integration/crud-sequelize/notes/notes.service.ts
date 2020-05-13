import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '../../../packages/crud-sequelize/src';

import { Note } from './note.model';

@Injectable()
export class NotesService extends SequelizeCrudService<Note> {
  constructor(@InjectModel(Note) repo) {
    super(repo);
  }
}

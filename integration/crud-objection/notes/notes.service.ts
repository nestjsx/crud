import { Inject, Injectable } from '@nestjs/common';

import { ObjectionCrudService } from '@nestjsx/crud-objection';
import { ModelClass } from 'objection';
import { Note } from './note.model';

@Injectable()
export class NotesService extends ObjectionCrudService<Note> {
  constructor(@Inject('Note') modelClass: ModelClass<Note>) {
    super(modelClass);
  }
}

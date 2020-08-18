import { Inject, Injectable } from '@nestjs/common';

import { ObjectionCrudService } from '../../../crud-objection/src/objection-crud.service';
import { Note } from '../../../../integration/crud-objection/notes';
import { ModelClass } from 'objection';

@Injectable()
export class NotesService extends ObjectionCrudService<Note> {
  constructor(@Inject('Note') modelClass: ModelClass<Note>) {
    super(modelClass);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '../../../crud-typeorm/src/typeorm-crud.service';
import { Note } from '../../../../integration/crud-typeorm/notes';

@Injectable()
export class NotesService extends TypeOrmCrudService<Note> {
  constructor(@InjectRepository(Note) repo) {
    super(repo);
  }
}

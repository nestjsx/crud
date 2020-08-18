import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Note } from './note.model';
import { NotesService } from './notes.service';
import { dto } from './requests';
import { serialize } from './responses';

@Crud({
  model: { type: Note },
  dto,
  serialize,
  query: {
    alwaysPaginate: true,
  },
})
@ApiTags('notes')
@Controller('/notes')
export class NotesController {
  constructor(public service: NotesService) {}
}

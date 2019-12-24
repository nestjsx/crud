import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';

@Crud({
  model: {
    type: Comment,
  },
  serialize: {
    get: false,
    getMany: false,
    createMany: false,
    create: false,
    update: false,
    replace: false,
    delete: false
  }
})
@Controller('comments')
export class CommentsController implements CrudController<Comment> {

  constructor(public service: CommentsService) {
  }
}

import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

@Crud({
  model: {
    type: Post,
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
@Controller('posts')
export class PostsController implements CrudController<Post> {

  constructor(public service: PostsService) {
  }
}

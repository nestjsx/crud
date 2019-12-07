import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

@Crud({
  model: {
    type: Post,
  },
})
@Controller('posts')
export class PostsController implements CrudController<Post> {

  constructor(public service: PostsService) {
  }
}

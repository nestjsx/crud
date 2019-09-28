import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Crud({
  model: {
    type: Category,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      children: {
        eager: true,
      },
      'children.children': {
        eager: true,
      },
    },
  },
})
@ApiUseTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(public service: CategoriesService) {}
}

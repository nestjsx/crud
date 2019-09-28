import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, File])],
  providers: [CategoriesService],
  exports: [CategoriesService
  ],
  controllers: [CategoriesController],
})
export class UsersModule {}

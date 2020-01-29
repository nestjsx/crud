import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../base-entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Comment extends BaseEntity {

  @IsString({ groups: [CREATE, UPDATE] })
  @IsOptional({ groups: [CREATE, UPDATE] })
  title?: string;

  @IsString({ groups: [CREATE] })
  userId?: string;

  @IsString({ groups: [CREATE] })
  postId?: string;

}

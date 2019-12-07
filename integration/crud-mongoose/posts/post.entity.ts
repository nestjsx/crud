import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../base-entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Post extends BaseEntity {

  @IsString({ groups: [CREATE] })
  @IsOptional({ groups: [CREATE] })
  id?: string;

  @IsString({ groups: [CREATE, UPDATE] })
  @IsOptional({ groups: [CREATE, UPDATE] })
  title?: string;


  @IsString({ groups: [CREATE] })
  @IsOptional({ groups: [CREATE] })
  userId?: string;
}

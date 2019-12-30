import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';

import { CrudValidationGroups } from '../../../src';

const { CREATE, UPDATE } = CrudValidationGroups;

export class TestModel {
  @IsEmpty({ groups: [CREATE] })
  @IsNumber({}, { groups: [UPDATE] })
  id?: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  firstName?: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  lastName?: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsEmail({ require_tld: false }, { always: true })
  email?: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({}, { always: true })
  age?: number;
}

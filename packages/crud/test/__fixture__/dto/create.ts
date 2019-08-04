import { CrudValidationGroups } from '@nestjsx/crud';
import { IsAlpha, IsEmail, IsNumber } from 'class-validator';

const { CREATE } = CrudValidationGroups;

export class CreateTestDTO {
  @IsAlpha({ groups: [CREATE] })
  firstName: string;

  @IsAlpha({ groups: [CREATE] })
  lastName: string;

  @IsNumber(
    {},
    {
      groups: [CREATE],
    },
  )
  age: number;

  @IsEmail(
    {},
    {
      groups: [CREATE],
    },
  )
  email: string;
}

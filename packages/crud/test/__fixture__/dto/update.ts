import { CrudValidationGroups } from '@nestjsx/crud';
import { IsAlpha, IsEmail, IsNumber, IsOptional } from 'class-validator';

const { UPDATE } = CrudValidationGroups;

export class UpdateTestDTO {
  @IsAlpha({ groups: [UPDATE] })
  @IsOptional({
    groups: [UPDATE],
  })
  firstName: string;

  @IsAlpha({ groups: [UPDATE] })
  @IsOptional({
    groups: [UPDATE],
  })
  lastName: string;

  @IsNumber(
    {},
    {
      groups: [UPDATE],
    },
  )
  age: number;

  @IsEmail(
    {},
    {
      groups: [UPDATE],
    },
  )
  @IsOptional({
    groups: [UPDATE],
  })
  email: string;
}

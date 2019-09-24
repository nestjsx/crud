import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { UserProfile } from '../../crud-typeorm/users-profiles';
const { CREATE, UPDATE } = CrudValidationGroups;

export class UserDto {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @IsEmail({ require_tld: false }, { always: true })
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsBoolean({ always: true })
  isActive: boolean;

  profileId?: number;

  companyId?: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ValidateNested({ always: true })
  profile: UserProfile
}

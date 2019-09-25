import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
const { CREATE, UPDATE } = CrudValidationGroups;

export class ProjectDto {
  @IsOptional({ groups: [UPDATE] })
  @IsDefined({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  name?: string;

  @IsOptional({ always: true })
  description?: string;

  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  isActive?: boolean;

  @IsOptional({ always: true })
  @IsNumber({}, { always: true })
  companyId?: number;
}

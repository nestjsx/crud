import { Type } from '@nestjs/class-transformer';

import { GetModelResponseDto } from './get-model-response.dto';

export class GetManyModelResponseDto {
  @Type(() => GetModelResponseDto)
  items: GetModelResponseDto[];
}

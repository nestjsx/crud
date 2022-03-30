import { Exclude, Expose } from '@nestjs/class-transformer';

@Exclude()
export class DeleteModelResponseDto {
  @Expose()
  id: number;
}

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeleteModelResponseDto {
  @Expose()
  id: number;
}

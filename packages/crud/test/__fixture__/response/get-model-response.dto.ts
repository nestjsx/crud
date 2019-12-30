import { Exclude } from 'class-transformer';

export class GetModelResponseDto {
  id: number;
  name: string;
  @Exclude()
  email: string;

  isActive: boolean;
}

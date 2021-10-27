import { Exclude } from 'class-transformer';

export class RecoverModelResponseDto {
  id: number;
  name: string;
  email: string;

  isActive: boolean;
}

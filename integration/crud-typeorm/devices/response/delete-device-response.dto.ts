import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DeleteDeviceResponseDto {
  @ApiProperty({ type: 'string' })
  deviceKey: string;

  @Exclude()
  description?: string;
}

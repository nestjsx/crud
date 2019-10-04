import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Device } from './device.entity';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService],
  exports: [DevicesService],
  controllers: [DevicesController],
})
export class DevicesModule {}

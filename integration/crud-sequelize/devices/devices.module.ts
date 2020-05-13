import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Device } from './device.model';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

@Module({
  imports: [SequelizeModule.forFeature([Device])],
  providers: [DevicesService],
  exports: [DevicesService],
  controllers: [DevicesController],
})
export class DevicesModule {}

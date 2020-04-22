import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import { Device } from './device.model';

@Injectable()
export class DevicesService extends SequelizeCrudService<Device> {
  constructor(@InjectModel(Device) repo) {
    super(repo);
  }
}

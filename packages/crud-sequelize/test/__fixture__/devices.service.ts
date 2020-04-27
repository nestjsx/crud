import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SequelizeCrudService } from '../../../crud-sequelize/src/sequelize-crud.service';
import { Device } from '../../../../integration/crud-sequelize/devices/device.model';

@Injectable()
export class DevicesService extends SequelizeCrudService<Device> {
  constructor(@InjectModel(Device) device) {
    super(device);
  }
}

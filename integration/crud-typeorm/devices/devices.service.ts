import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@vianneybr/nestjsx-crud-typeorm';

import { Device } from './device.entity';

@Injectable()
export class DevicesService extends TypeOrmCrudService<Device> {
  constructor(@InjectRepository(Device) repo) {
    super(repo);
  }
}

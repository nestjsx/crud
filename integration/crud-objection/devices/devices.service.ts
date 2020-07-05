import { Inject, Injectable } from '@nestjs/common';

import { Device } from './device.model';
import { ObjectionCrudService } from '@nestjsx/crud-objection';
import { ModelClass } from 'objection';

@Injectable()
export class DevicesService extends ObjectionCrudService<Device> {
  constructor(@Inject('Device') modelClass: ModelClass<Device>) {
    super(modelClass);
  }
}

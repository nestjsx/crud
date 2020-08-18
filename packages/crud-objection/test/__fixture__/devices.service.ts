import { Inject, Injectable } from '@nestjs/common';
import { Device } from '../../../../integration/crud-objection/devices';
import { ModelClass } from 'objection';
import { ObjectionCrudService } from '../../../crud-objection/src/objection-crud.service';

@Injectable()
export class DevicesService extends ObjectionCrudService<Device> {
  constructor(@Inject('Device') modelClass: ModelClass<Device>) {
    super(modelClass);
  }
}

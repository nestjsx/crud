import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@rewiko/crud';

import { Device } from './device.entity';
import { DevicesService } from './devices.service';
import { serialize } from './response';

@Crud({
  model: { type: Device },
  serialize,
  params: {
    deviceKey: {
      field: 'deviceKey',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@ApiTags('devices')
@Controller('/devices')
export class DevicesController {
  constructor(public service: DevicesService) {}
}

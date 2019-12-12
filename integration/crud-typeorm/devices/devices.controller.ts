import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Device } from './device.entity';
import { DevicesService } from './devices.service';

@Crud({
  model: { type: Device },
  params: {
    deviceKey: {
      field: 'deviceKey',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiTags('devices')
@Controller('/devices')
export class DevicesController {
  constructor(public service: DevicesService) {}
}

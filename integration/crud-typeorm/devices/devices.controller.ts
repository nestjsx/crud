import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
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
@ApiUseTags('devices')
@Controller('/devices')
export class DevicesController {
  constructor(public service: DevicesService) {}
}

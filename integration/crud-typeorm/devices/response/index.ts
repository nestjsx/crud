import { SerializeOptions } from '@rewiko/crud';
import { DeleteDeviceResponseDto } from './delete-device-response.dto';

export const serialize: SerializeOptions = {
  delete: DeleteDeviceResponseDto,
};

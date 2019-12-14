import { SerializeOptions } from '@nestjsx/crud';
import { CreateCompanyResponseDto } from './create-company-response.dto';
import { GetCompanyResponseDto } from './get-company-response.dto';

export const serialize: SerializeOptions = {
  get: GetCompanyResponseDto,
  create: CreateCompanyResponseDto,
};

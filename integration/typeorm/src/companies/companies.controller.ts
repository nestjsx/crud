import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudOptions,
  Override,
  ParsedQuery,
  ParsedOptions,
  ParsedParams,
  ParsedBody,
  EntitiesBulk,
  UsePathInterceptors,
  RestfulParamsDto,
} from '@nestjsx/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

@Crud(Company, {
  params: {},
  routes: {},
  options: {
    join: {
      users: {
        exclude: ['password'],
      },
    },
    sort: [{ field: 'id', order: 'DESC' }],
    maxLimit: 5,
    cache: 10000,
  },
})
@ApiUseTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  get base(): CrudController<CompaniesService, Company> {
    return this;
  }

  @Override()
  async getOne(@ParsedQuery() query, @ParsedOptions() options) {
    return this.base.getOneBase(query, options);
  }

  @Override()
  async createOne(@ParsedParams() params, @ParsedBody() body: Company) {
    return this.base.createOneBase(params, body);
  }

  @Override()
  async createMany(@ParsedParams() params, @ParsedBody() body: EntitiesBulk<Company>) {
    return this.base.createManyBase(params, body);
  }

  @Get('/custom/get-all')
  @UsePathInterceptors()
  async customRoute(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedParams() params,
    @ParsedOptions() options: CrudOptions,
  ) {
    return { query, params, options };
  }
}

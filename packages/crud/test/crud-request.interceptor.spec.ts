import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import * as supertest from 'supertest';
import { ParsedRequest } from '../src/decorators';
import { CrudRequestInterceptor } from '../src/interceptors';
import { CrudRequest } from '../src/interfaces';

describe('#crud', () => {
  @UseInterceptors(
    new CrudRequestInterceptor({
      params: {
        someParam: {
          field: 'someParam',
          type: 'number',
        },
      },
    }),
  )
  @Controller('test')
  class TestController {
    @Get('/query')
    async query(@ParsedRequest() req: CrudRequest) {
      return req;
    }

    @Get('/other')
    async other(@Query('page', ParseIntPipe) page: number) {
      return { page };
    }

    @Get('/other2/:someParam')
    async routeWithParam(@Param('someParam', ParseIntPipe) p: number) {
      return { p };
    }
  }

  let $: supertest.SuperTest<supertest.Test>;
  let app: NestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    $ = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('#interceptor', () => {
    let qb: RequestQueryBuilder;

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    it('should working on non-crud controller', async () => {
      const page = 2;
      const limit = 10;
      const fields = ['a', 'b', 'c'];
      const sorts: any[][] = [['a', 'ASC'], ['b', 'DESC']];
      const filters: any[][] = [['a', 'eq', 1], ['c', 'in', [1, 2, 3]], ['d', 'notnull']];

      qb.setPage(page).setLimit(limit);
      qb.select(fields);
      for (const s of sorts) {
        qb.sortBy({ field: s[0], order: s[1] });
      }
      for (const f of filters) {
        qb.setFilter({ field: f[0], operator: f[1], value: f[2] });
      }

      const res = await $.get('/test/query')
        .query(qb.query())
        .expect(200);

      // console.log(qb.query(), JSON.stringify(res.body));

      expect(res.body.parsed).toHaveProperty('page', page);
      expect(res.body.parsed).toHaveProperty('limit', limit);
      expect(res.body.parsed).toHaveProperty('fields', fields);
      expect(res.body.parsed).toHaveProperty('sort');
      for (let i = 0; i < sorts.length; i++) {
        expect(res.body.parsed.sort[i]).toHaveProperty('field', sorts[i][0]);
        expect(res.body.parsed.sort[i]).toHaveProperty('order', sorts[i][1]);
      }
      expect(res.body.parsed).toHaveProperty('filter');
      for (let i = 0; i < filters.length; i++) {
        expect(res.body.parsed.filter[i]).toHaveProperty('field', filters[i][0]);
        expect(res.body.parsed.filter[i]).toHaveProperty('operator', filters[i][1]);
        expect(res.body.parsed.filter[i]).toHaveProperty('value', filters[i][2] || '');
      }
    });

    it('should others working', async () => {
      const res = await $.get('/test/other')
        .query({ page: 2, per_page: 11 })
        .expect(200);
      expect(res.body.page).toBe(2);
    });

    it('should parse param', async () => {
      const res = await $.get('/test/other2/123').expect(200);
      expect(res.body.p).toBe(123);
    });
  });
});

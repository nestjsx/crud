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
import { RequestQueryBuilder } from '@rewiko/crud-request';
import * as supertest from 'supertest';
import { Crud, ParsedRequest, CrudAuth, Override } from '../src/decorators';
import { CrudRequestInterceptor } from '../src/interceptors';
import { CrudRequest } from '../src/interfaces';
import { TestModel } from './__fixture__/models';
import { TestService } from './__fixture__/services';

// tslint:disable:max-classes-per-file
describe('#crud', () => {
  @UseInterceptors(CrudRequestInterceptor)
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

  @Crud({
    model: { type: TestModel },
    params: {
      someParam: { field: 'someParam', type: 'number' },
    },
  })
  @Controller('test2')
  class Test2Controller {
    constructor(public service: TestService<TestModel>) {}

    @UseInterceptors(CrudRequestInterceptor)
    @Get('normal/:id')
    async normal(@ParsedRequest() req: CrudRequest) {
      return { filter: req.parsed.paramsFilter };
    }

    @UseInterceptors(CrudRequestInterceptor)
    @Get('/other2/:someParam')
    async routeWithParam(@Param('someParam', ParseIntPipe) p: number) {
      return { p };
    }

    @UseInterceptors(CrudRequestInterceptor)
    @Get('other2/:id/twoParams/:someParam')
    async twoParams(
      @ParsedRequest() req: CrudRequest,
      @Param('someParam', ParseIntPipe) p: number,
    ) {
      return { filter: req.parsed.paramsFilter };
    }
  }

  @Crud({
    model: { type: TestModel },
    query: {
      filter: () => ({ name: 'persist' }),
    },
  })
  @CrudAuth({
    property: 'user',
    filter: (user) => ({ user: 'test', buz: 1 }),
    persist: () => ({ bar: false }),
  })
  @Controller('test3')
  class Test3Controller {
    constructor(public service: TestService<TestModel>) {}

    @Override('getManyBase')
    get(@ParsedRequest() req: CrudRequest) {
      return req;
    }

    @Override('createOneBase')
    post(@ParsedRequest() req: CrudRequest) {
      return req;
    }
  }

  @Crud({
    model: { type: TestModel },
  })
  @CrudAuth({
    or: () => ({ id: 1 }),
  })
  @Controller('test4')
  class Test4Controller {
    constructor(public service: TestService<TestModel>) {}

    @Override('getManyBase')
    get(@ParsedRequest() req: CrudRequest) {
      return req;
    }
  }

  @Crud({
    model: { type: TestModel },
    params: {
      someParam: { field: 'someParam', type: 'number', primary: true },
      someParam2: { field: 'someParam2', type: 'number', primary: true },
    },
  })
  @Controller('test5')
  class Test5Controller {
    constructor(public service: TestService<TestModel>) {}
  }

  let $: supertest.SuperTest<supertest.Test>;
  let app: NestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TestService],
      controllers: [
        TestController,
        Test2Controller,
        Test3Controller,
        Test4Controller,
        Test5Controller,
      ],
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

    it('should parse custom param in crud', async () => {
      const res = await $.get('/test2/other2/123').expect(200);
      expect(res.body.p).toBe(123);
    });

    it('should parse crud param and custom param', async () => {
      const res = await $.get('/test2/other2/1/twoParams/123').expect(200);
      expect(res.body.filter).toHaveLength(2);
      expect(res.body.filter[0].field).toBe('id');
      expect(res.body.filter[0].value).toBe(1);
    });

    it('should parse multiple primary key', async () => {
      const res = await $.get('/test5/123/456').expect(200);
    });

    it('should work like before', async () => {
      const res = await $.get('/test2/normal/0').expect(200);
      expect(res.body.filter).toHaveLength(1);
      expect(res.body.filter[0].field).toBe('id');
      expect(res.body.filter[0].value).toBe(0);
    });

    it('should handle authorized request, 1', async () => {
      const res = await $.post('/test3')
        .send({})
        .expect(201);
      const authPersist = { bar: false };
      const { parsed } = res.body;
      expect(parsed.authPersist).toMatchObject(authPersist);
    });

    it('should handle authorized request, 2', async () => {
      const res = await $.get('/test3').expect(200);
      const search = { $and: [{ user: 'test', buz: 1 }, {}] };
      expect(res.body.parsed.search).toMatchObject(search);
    });

    it('should handle authorized request, 3', async () => {
      const query = qb.search({ name: 'test' }).query();
      const res = await $.get('/test4')
        .query(query)
        .expect(200);
      const search = { $or: [{ id: 1 }, { $and: [{}, { name: 'test' }] }] };
      expect(res.body.parsed.search).toMatchObject(search);
    });
    it('should handle authorized request, 4', async () => {
      const query = qb.search({ name: 'test' }).query();
      const res = await $.get('/test3')
        .query(query)
        .expect(200);
      const search = { $and: [{ user: 'test', buz: 1 }, { name: 'persist' }] };
      expect(res.body.parsed.search).toMatchObject(search);
    });
  });
});

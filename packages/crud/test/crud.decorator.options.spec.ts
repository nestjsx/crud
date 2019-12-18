import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { Crud } from '../src/decorators';
import { CrudOptions } from '../src/interfaces';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/models';
import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#options', () => {
    let app: INestApplication;
    let server: any;

    const options: CrudOptions = {
      model: { type: TestModel },
      params: {
        id: {
          field: 'id',
          type: 'uuid',
          primary: true,
        },
      },
      query: {
        limit: 10,
      },
      routes: {
        getManyBase: {
          interceptors: [],
          decorators: [],
        },
        getOneBase: {
          interceptors: [],
          decorators: [],
        },
        createOneBase: {
          interceptors: [],
          decorators: [],
        },
        createManyBase: {
          interceptors: [],
          decorators: [],
        },
        updateOneBase: {
          interceptors: [],
          decorators: [],
          allowParamsOverride: true,
        },
        replaceOneBase: {
          interceptors: [],
          decorators: [],
          allowParamsOverride: true,
        },
        deleteOneBase: {
          interceptors: [],
          decorators: [],
          returnDeleted: true,
        },
      },
    };

    @Crud(options)
    @Controller('test')
    class TestController {
      constructor(public service: TestService<TestModel>) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        controllers: [TestController],
        providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }, TestService],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = app.getHttpServer();
    });

    afterAll(async () => {
      app.close();
    });

    it('should return options in ParsedRequest', (done) => {
      return request(server)
        .get('/test')
        .expect(200)
        .end((_, res) => {
          const opt = res.body.req.options;
          expect(opt.query).toMatchObject(options.query);
          expect(opt.routes).toMatchObject(options.routes);
          expect(opt.params).toMatchObject(options.params);
          done();
        });
    });
  });
});

import { Controller, Get, INestApplication, SetMetadata, UseInterceptors } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CrudRequestInterceptor } from '../lib/interceptors';

import { CRUD_OPTIONS_METADATA } from '../src/constants';
import { Crud, ParsedRequest } from '../src/decorators';
import { CrudOptions, CrudRequest, CrudRequestOptions } from '../src/interfaces';
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
        filter: { name: 'test' },
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
    const additionalOptions: CrudRequestOptions = {
      query: {
        filter: [{ field: 'for_method_a_only', operator: 'eq', value: true }],
      },
    };

    @Crud(options)
    @Controller('test')
    class TestController {
      constructor(public service: TestService<TestModel>) {
      }

      @SetMetadata(CRUD_OPTIONS_METADATA, additionalOptions)
      @Get('method-a')
      @UseInterceptors(CrudRequestInterceptor)
      methodA(@ParsedRequest() req: CrudRequest) {
        return { req };
      }
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

    it('should return method options in ParsedRequest', async () => {
      const res = await request(server)
        .get('/test/method-a')
        .expect(200);

      const opt = res.body.req.options;

      expect(opt.query).toMatchObject({ ...options.query, ...additionalOptions.query });
    });
  });
});

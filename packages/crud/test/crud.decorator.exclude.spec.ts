import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { Crud } from '../src/decorators';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/models';
import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#exclude routes', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: TestModel },
      routes: {
        exclude: ['getManyBase'],
      },
    })
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

    describe('#getManyBase excluded', () => {
      it('should return status 404', () => {
        return request(server)
          .get('/test')
          .expect(404);
      });
    });
  });

  describe('#only routes', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: TestModel },
      routes: {
        only: ['getManyBase'],
      },
    })
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

    describe('#getManyBase only', () => {
      it('should return status 200', () => {
        return request(server)
          .get('/test')
          .expect(200);
      });
    });

    describe('#getOneBase excluded', () => {
      it('should return status 404', () => {
        return request(server)
          .get('/test/1')
          .expect(404);
      });
    });
  });
});

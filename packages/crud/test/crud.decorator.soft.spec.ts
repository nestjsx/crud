import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { Crud } from '../src/decorators';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/models';
import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#soft delete disabled', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: TestModel },
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

    describe('#recoverOneBase', () => {
      it('should return status 404 if controller does not have soft delete', () => {
        return request(server)
          .patch('/test/1/recover')
          .expect(404);
      });
    });
  });

  describe('#soft delete enabled', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: TestModel },
      query: {
        softDelete: true,
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

    describe('#recoverOneBase', () => {
      it('should return status 200 if controller has soft delete', () => {
        return request(server)
          .patch('/test/1/recover')
          .expect(200);
      });
    });
  });
});

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { Crud } from '../src/decorators/crud.decorator';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/models';
import { TestCreateDto, TestUpdateDto } from './__fixture__/dto';
import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#dto options', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: {
        type: TestModel,
      },
      dto: {
        create: TestCreateDto,
        update: TestUpdateDto,
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
      await app.close();
    });

    describe('#createOneBase', () => {
      it('should return status 201', () => {
        const send: TestCreateDto = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        return request(server)
          .post('/test')
          .send(send)
          .expect(201);
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
        };
        return request(server)
          .post('/test')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('#updateOneBase', () => {
      it('should return status 200', () => {
        const send: TestModel = {
          id: 1,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        return request(server)
          .patch('/test/1')
          .send(send)
          .expect(200);
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'foo',
        };
        return request(server)
          .patch('/test/1')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });
});

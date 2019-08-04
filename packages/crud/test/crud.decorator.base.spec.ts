import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { Crud } from '../src/decorators/crud.decorator';
import { CreateManyDto } from '../src/interfaces';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/test.model';
import { TestService } from './__fixture__/test.service';

describe('#crud', () => {
  describe('#base methods', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;

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

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterAll(async () => {
      app.close();
    });

    describe('#getManyBase', () => {
      it('should return status 200', () => {
        return request(server)
          .get('/test')
          .expect(200);
      });
      it('should return status 400', (done) => {
        const query = qb.setFilter({ field: 'foo', operator: 'gt' }).query();
        return request(server)
          .get('/test')
          .query(query)
          .expect(500)
          .end((_, res) => {
            const expected = { statusCode: 400, message: 'Invalid filter value' };
            expect(res.body).toMatchObject(expected);
            done();
          });
      });
    });

    describe('#getOneBase', () => {
      it('should return status 200', () => {
        return request(server)
          .get('/test/1')
          .expect(200);
      });
      it('should return status 400', (done) => {
        return request(server)
          .get('/test/invalid')
          .expect(400)
          .end((_, res) => {
            const expected = {
              statusCode: 400,
              message: 'Invalid param id. Number expected',
            };
            expect(res.body).toMatchObject(expected);
            done();
          });
      });
    });

    describe('#createOneBase', () => {
      it('should return status 201', () => {
        const send: TestModel = {
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
          .expect(400)
          .end((_, res) => {
            expect(res.body.message[0].property).toBe('age');
            done();
          });
      });
    });

    describe('#createManyBase', () => {
      it('should return status 201', () => {
        const send: CreateManyDto<TestModel> = {
          bulk: [
            {
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'test@test.com',
              age: 15,
            },
            {
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'test@test.com',
              age: 15,
            },
          ],
        };
        return request(server)
          .post('/test/bulk')
          .send(send)
          .expect(201);
      });
      it('should return status 400', (done) => {
        const send: CreateManyDto<TestModel> = {
          bulk: [],
        };
        return request(server)
          .post('/test/bulk')
          .send(send)
          .expect(400)
          .end((_, res) => {
            expect(res.body.message[0].property).toBe('bulk');
            done();
          });
      });
    });

    describe('#replaceOneBase', () => {
      it('should return status 200', () => {
        const send: TestModel = {
          id: 1,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        return request(server)
          .put('/test/1')
          .send(send)
          .expect(200);
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
        };
        return request(server)
          .put('/test/1')
          .send(send)
          .expect(400)
          .end((_, res) => {
            expect(res.body.message[0].property).toBe('id');
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
          email: 'test@test.com',
        };
        return request(server)
          .patch('/test/1')
          .send(send)
          .expect(400)
          .end((_, res) => {
            expect(res.body.message[0].property).toBe('id');
            done();
          });
      });
    });

    describe('#deleteOneBase', () => {
      it('should return status 200', () => {
        return request(server)
          .delete('/test/1')
          .expect(200);
      });
    });
  });
});

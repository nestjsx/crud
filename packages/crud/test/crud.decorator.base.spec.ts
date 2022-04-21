import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { Crud } from '../src/decorators/crud.decorator';
import { CreateManyDto } from '../src/interfaces';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestModel } from './__fixture__/models';
import { TestService } from './__fixture__/services';

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
      it('should return status 200', (done) => {
        request(server)
          .get('/test')
          .end((_, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
      it('should return status 400', (done) => {
        const query = qb.setFilter({ field: 'foo', operator: 'gt' }).query();
        request(server)
          .get('/test')
          .query(query)
          .end((_, res) => {
            const expected = { statusCode: 400, message: 'Invalid filter value' };
            expect(res.status).toEqual(400);
            expect(res.body).toMatchObject(expected);
            done();
          });
      });
    });

    describe('#getOneBase', () => {
      it('should return status 200', (done) => {
        request(server)
          .get('/test/1')
          .end((_, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
      it('should return status 400', (done) => {
        request(server)
          .get('/test/invalid')
          .end((_, res) => {
            const expected = {
              statusCode: 400,
              message: 'Invalid param id. Number expected',
            };
            expect(res.status).toEqual(400);
            expect(res.body).toMatchObject(expected);
            done();
          });
      });
    });

    describe('#createOneBase', () => {
      it('should return status 201', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        request(server)
          .post('/test')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(201);
            done();
          });
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
        };
        request(server)
          .post('/test')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('#createMadyBase', () => {
      it('should return status 201', (done) => {
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
        request(server)
          .post('/test/bulk')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(201);
            done();
          });
      });
      it('should return status 400', (done) => {
        const send: CreateManyDto<TestModel> = {
          bulk: [],
        };
        request(server)
          .post('/test/bulk')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('#replaceOneBase', () => {
      it('should return status 200', (done) => {
        const send: TestModel = {
          id: 1,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        request(server)
          .put('/test/1')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
        };
        request(server)
          .put('/test/1')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('#updateOneBase', () => {
      it('should return status 200', (done) => {
        const send: TestModel = {
          id: 1,
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
          age: 15,
        };
        request(server)
          .patch('/test/1')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
      it('should return status 400', (done) => {
        const send: TestModel = {
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'test@test.com',
        };
        request(server)
          .patch('/test/1')
          .send(send)
          .end((_, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });

    describe('#deleteOneBase', () => {
      it('should return status 200', (done) => {
        request(server)
          .delete('/test/1')
          .end((_, res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
});

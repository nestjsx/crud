import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication, Inject } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { Crud } from '../src/decorators';
import { HttpExceptionFilter } from './__fixture__/exception.filter';
import { TestSerializeModel, TestSerializeTransformModel } from './__fixture__/models';

import { TestSerializeService } from './__fixture__/services';


describe('#crud', () => {
  describe('#transform', () => {
    let app: INestApplication;
    let server: any;
   
    const SERVICE = 'TestSerializeService';

    @Crud({
      model: {
        type: TestSerializeTransformModel,
      },
      query: {
        alwaysPaginate: true,
      },
    })
    @Controller('test')
    class TestController {
      constructor(@Inject(SERVICE) public service: TestSerializeService) {}
    }
    
    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        controllers: [
          TestController
        ],
        providers: [
          {
            provide: SERVICE,
            useFactory: () => new TestSerializeService(TestSerializeModel),
          }
        ],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = app.getHttpServer();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#transform', () => {
      it('transform only one times', (done) => {
        return request(server)
          .get('/test')
          .expect(200)
          .end((_, res) => {
            expect(res.body.data[0].name).toBe('1:name');
            done();
          });
      });
    });

  });
});

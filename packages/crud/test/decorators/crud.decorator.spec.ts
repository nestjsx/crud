import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication, Injectable, Param } from '@nestjs/common';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { Crud } from '../../src/decorators/crud.decorator';

@Injectable()
class TestService {}

@Crud({
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
})
@Controller('test')
class TestController {
  constructor(public service: TestService) {}
}

describe('#crud', () => {
  describe('@Crud decorator', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        controllers: [TestController],
        providers: [TestService],
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

    it('/GET / (200)', (done) => {
      const query = qb
        .select(['name', 'email'])
        .setFilter({ field: 'name', operator: 'notnull' })
        .setFilter({ field: 'email', operator: 'eq', value: 'mm' })
        .setLimit(10)
        .sortBy({ field: 'email', order: 'ASC' })
        .resetCache()
        .query();

      return request(server)
        .get('/test/5')
        .query(query)
        .expect(200)
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });
  });
});

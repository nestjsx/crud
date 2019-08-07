import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { Crud } from '../../crud/src/decorators/crud.decorator';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { Company } from '../../../integration/crud-objection/companies';
import { User } from '../../../integration/crud-objection/users';
import { CompaniesService } from './__fixture__/companies.service';
import { UsersService } from './__fixture__/users.service';
import { DatabaseModule } from '../../../integration/crud-objection/database.module';

describe('#crud-objection', () => {
  describe('#basic crud', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
    })
    @Controller('companies')
    class CompaniesController {
      constructor(public service: CompaniesService) {}
    }

    @Crud({
      model: { type: User },
      params: {
        companyId: {
          field: 'companyId',
          type: 'number',
        },
        id: {
          field: 'id',
          type: 'number',
          primary: true,
        },
      },
      routes: {
        deleteOneBase: {
          returnDeleted: true,
        },
      },
      query: {
        persist: ['isActive'],
        cache: 10,
      },
      validation: {
        transform: true,
      },
    })
    @Controller('companies/:companyId/users')
    class UsersController {
      constructor(public service: UsersService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [DatabaseModule],
        controllers: [CompaniesController, UsersController],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
          UsersService,
        ],
      }).compile();

      app = fixture.createNestApplication();
      service = app.get<CompaniesService>(CompaniesService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterAll(async () => {
      app.close();
    });

    describe('#find', () => {
      it('should return entities', async () => {
        const data = await service.modelClass.query();
        expect(data.length).toBe(10);
      });
    });

    describe('#findOne', () => {
      it('should return one entity', async () => {
        const data = await service.modelClass.query().findById(1);
        expect(data.id).toBe(1);
      });
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', (done) => {
        return request(server)
          .get('/companies')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            done();
          });
      });
      it('should return an entities with limit', (done) => {
        const query = qb.setLimit(5).query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(5);
            done();
          });
      });
      it('should return an entities with limit and page', (done) => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: 'id', order: 'DESC' })
          .query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.total).toBe(10);
            expect(res.body.page).toBe(1);
            expect(res.body.pageCount).toBe(4);
            done();
          });
      });
      it('should return an entities with offset', (done) => {
        const query = qb.setOffset(3).query();
        return request(server)
          .get('/companies')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(7);
            done();
          });
      });
    });

    describe('#getOneBase', () => {
      it('should return status 404', (done) => {
        return request(server)
          .get('/companies/333')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return an entity, 1', (done) => {
        return request(server)
          .get('/companies/1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            done();
          });
      });
      it('should return an entity, 2', (done) => {
        const query = qb.select(['domain']).query();
        return request(server)
          .get('/companies/1')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.domain).toBeTruthy();
            done();
          });
      });
      it('should return a user entity', (done) => {
        return request(server)
          .get('/companies/1/users/1')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
    });

    describe('#createOneBase', () => {
      it('should return status 400', (done) => {
        return request(server)
          .post('/companies')
          .send('')
          .end((_, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message.length).toBe(2);

            expect(res.body.message[0].constraints.maxLength).toBe(
              `name must be shorter than or equal to 100 characters`,
            );
            expect(res.body.message[0].constraints.isString).toBe(
              `name must be a string`,
            );
            expect(res.body.message[0].constraints.isNotEmpty).toBe(
              `name should not be empty`,
            );

            expect(res.body.message[1].constraints.maxLength).toBe(
              `domain must be shorter than or equal to 100 characters`,
            );
            expect(res.body.message[1].constraints.isString).toBe(
              `domain must be a string`,
            );
            expect(res.body.message[1].constraints.isNotEmpty).toBe(
              `domain should not be empty`,
            );
            done();
          });
      });
      it('should return saved entity', (done) => {
        const dto = {
          name: 'test0',
          domain: 'test0',
        };
        return request(server)
          .post('/companies')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
            done();
          });
      });
      it('should return saved entity with param', (done) => {
        const dto: Partial<User> = {
          email: 'test@test.com',
          isActive: true,
          profile: {
            name: 'testName',
          },
        };
        return request(server)
          .post('/companies/1/users')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
            expect(res.body.companyId).toBe(1);
            expect(res.body.profile).toBeTruthy();
            expect(res.body.profile.name).toBe('testName');
            done();
          });
      });
    });

    describe('#createManyBase', () => {
      it('should return status 400', (done) => {
        const dto = { bulk: [] };
        return request(server)
          .post('/companies/bulk')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message.length).toBe(1);
            expect(res.body.message[0].constraints.arrayNotEmpty).toBe(
              `bulk should not be empty`,
            );
            done();
          });
      });
      [
        { companyPrefix: 'foo', amount: 50 },
        { companyPrefix: 'bar', amount: 1001 },
      ].forEach(({ amount, companyPrefix }) => {
        it(`should return ${amount} created entities for ${companyPrefix}-* companies`, (done) => {
          const dto = {
            bulk: Array.from({ length: amount }, (_, idx: number) => {
              return {
                name: `${companyPrefix}-${idx}`,
                domain: `${companyPrefix}-${idx}`,
              };
            }),
          };
          return request(server)
            .post('/companies/bulk')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(201);
              expect(res.body.length).toBe(amount);
              res.body.forEach((company) => {
                expect(company.id).toBeTruthy();
              });

              done();
            });
        });
      });
    });

    describe('#updateOneBase', () => {
      it('should return status 404', (done) => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/33333333')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return updated entity, 1', (done) => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/1')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
            done();
          });
      });
      it('should return updated entity, 2', (done) => {
        const dto = { isActive: false, companyId: 5 };
        return request(server)
          .patch('/companies/1/users/21')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.isActive).toBe(false);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
    });

    describe('#replaceOneBase', () => {
      it('should create entity, 1', (done) => {
        const dto = { name: 'updated0', domain: 'domain0' };
        return request(server)
          .put('/companies/333')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
            done();
          });
      });
      it('should return updated entity, 1', (done) => {
        const dto = { name: 'updated-foo' };
        return request(server)
          .put('/companies/1')
          .send(dto)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated-foo');
            done();
          });
      });
    });

    describe('#deleteOneBase', () => {
      it('should return status 404', (done) => {
        return request(server)
          .delete('/companies/33333333')
          .end((_, res) => {
            expect(res.status).toBe(404);
            done();
          });
      });
      it('should return deleted entity', (done) => {
        return request(server)
          .delete('/companies/1/users/21')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(21);
            expect(res.body.companyId).toBe(1);
            done();
          });
      });
    });
  });
});

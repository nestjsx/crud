import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';

import { Crud } from '@nestjsx/crud';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import request from 'supertest';
import { Company } from '../../../integration/crud-sequelize/companies/company.model';
import { Device } from '../../../integration/crud-sequelize/devices/device.model';
import { config } from '../../../integration/crud-sequelize/sequelize.config';
import { Project } from '../../../integration/crud-sequelize/projects/project.model';
import { User } from '../../../integration/crud-sequelize/users/user.model';
import { UserProfile } from '../../../integration/crud-sequelize/users-profiles/userprofile.model';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { CompaniesService } from './__fixture__/companies.service';
import { UsersService } from './__fixture__/users.service';
import { DevicesService } from './__fixture__/devices.service';
import { MigrationHelper } from './migration-helper';
import { Sequelize } from 'sequelize';

// tslint:disable:max-classes-per-file no-shadowed-variable
describe('#crud-sequelize', () => {
  beforeEach(async () => {
    const helper = new MigrationHelper(
      new Sequelize({ ...config, logging: !!process.env.SQL_LOG ? console.log : false }),
    );
    try {
      await helper.down();
      await helper.up();
    } finally {
      await helper.close();
    }
  });

  describe('#basic crud using alwaysPaginate default respects global limit', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
      query: {
        alwaysPaginate: true,
        limit: 3,
      },
    })
    @Controller('companies')
    class CompaniesController {
      constructor(public service: CompaniesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [SequelizeModule.forRoot(config), SequelizeModule.forFeature([Company])],
        controllers: [CompaniesController],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
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
      await app.close();
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', async () => {
        return request(server)
          .get('/companies')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.page).toBe(1);
          });
      });
    });
  });

  describe('#basic crud using alwaysPaginate default', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: CompaniesService;

    @Crud({
      model: { type: Company },
      query: { alwaysPaginate: true },
    })
    @Controller('companies')
    class CompaniesController {
      constructor(public service: CompaniesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [SequelizeModule.forRoot(config), SequelizeModule.forFeature([Company])],
        controllers: [CompaniesController],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
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
      await app.close();
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', () => {
        return request(server)
          .get('/companies')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(10);
            expect(res.body.page).toBe(1);
          });
      });
      it('should return an entities with limit', () => {
        const query = qb.setLimit(5).query();
        return request(server)
          .get('/companies')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(5);
            expect(res.body.page).toBe(1);
          });
      });
      it('should return an entities with limit and page', () => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: 'id', order: 'DESC' })
          .query();
        return request(server)
          .get('/companies')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.page).toBe(1);
          });
      });
    });
  });

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

    @Crud({
      model: { type: User },
      query: {
        join: {
          profile: {
            eager: true,
            required: true,
          },
        },
      },
    })
    @Controller('/users2')
    class UsersController2 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: User },
      query: {
        join: {
          profile: {
            eager: true,
          },
        },
      },
    })
    @Controller('/users3')
    class UsersController3 {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: { type: Device },
      params: {
        deviceKey: {
          field: 'deviceKey',
          type: 'uuid',
          primary: true,
        },
      },
      routes: {
        createOneBase: {
          returnShallow: true,
        },
      },
    })
    @Controller('devices')
    class DevicesController {
      constructor(public service: DevicesService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          SequelizeModule.forRoot({ ...config, logging: false }),
          SequelizeModule.forFeature([Company, Project, User, UserProfile, Device]),
        ],
        controllers: [
          CompaniesController,
          UsersController,
          UsersController2,
          UsersController3,
          DevicesController,
        ],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
          UsersService,
          DevicesService,
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
      await app.close();
    });

    describe('#find', () => {
      it('should return entities', async () => {
        const data = await service.find();
        expect(data.length).toBe(10);
      });
    });

    describe('#findOne', () => {
      it('should return one entity', async () => {
        const data = await service.findOne({ where: { id: 1 } });
        expect(data.id).toBe(1);
      });
    });

    describe('#count', () => {
      it('should return number', async () => {
        const data = await service.count();
        expect(typeof data).toBe('number');
      });
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', async () => {
        await request(server)
          .get('/companies')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
          });
      });
      it('should return an entities with limit', async () => {
        const query = qb.setLimit(5).query();
        await request(server)
          .get('/companies')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(5);
          });
      });
      it('should return an entities with limit and page', async () => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: 'id', order: 'DESC' })
          .query();
        await request(server)
          .get('/companies')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.total).toBe(10);
            expect(res.body.page).toBe(1);
            expect(res.body.pageCount).toBe(4);
          });
      });
      it('should return an entities with offset', async () => {
        const query = qb.setOffset(3).query();
        await request(server)
          .get('/companies')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(7);
          });
      });
    });

    describe('#getOneBase', () => {
      it('should return status 404', async () => {
        await request(server)
          .get('/companies/333')
          .expect((res) => {
            expect(res.status).toBe(404);
          });
      });
      it('should return an entity, 1', () => {
        return request(server)
          .get('/companies/1')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
          });
      });
      it('should return an entity, 2', () => {
        const query = qb.select(['domain']).query();
        return request(server)
          .get('/companies/1')
          .query(query)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.domain).toBeTruthy();
          });
      });
      it('should return an entity with and set cache', () => {
        return request(server)
          .get('/companies/1/users/1')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.companyId).toBe(1);
          });
      });

      // No embedded entity properties in sequelize
      /*it('should return an entity with its embedded entity properties', () => {
        return request(server)
          .get('/companies/1/users/1')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.name.first).toBe('firstname1');
            expect(res.body.name.last).toBe('lastname1');
          });
      });*/
    });

    describe('#createOneBase', () => {
      it('should return status 400', () => {
        return request(server)
          .post('/companies')
          .send('')
          .expect((res) => {
            expect(res.status).toBe(400);
          });
      });
      it('should return saved entity', () => {
        const dto = {
          name: 'test0',
          domain: 'test0',
        };
        return request(server)
          .post('/companies')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
          });
      });
      it('should return saved entity with param', () => {
        const dto: any = {
          email: 'test@test.com',
          isActive: true,
          name: {
            first: 'test',
            last: 'last',
          },
          profile: {
            name: 'testName',
          },
        };
        return request(server)
          .post('/companies/1/users')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(201);
            expect(res.body.id).toBeTruthy();
            expect(res.body.companyId).toBe(1);
          });
      });
      it('should return with `returnShallow`', () => {
        const dto: any = { description: 'returnShallow is true' };
        return request(server)
          .post('/devices')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(201);
            expect(res.body.deviceKey).toBeTruthy();
            expect(res.body.description).toBeTruthy();
          });
      });
    });

    describe('#createManyBase', () => {
      it('should return status 400', () => {
        const dto = { bulk: [] };
        return request(server)
          .post('/companies/bulk')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(400);
          });
      });
      it('should return created entities', () => {
        const dto = {
          bulk: [
            {
              name: 'test1',
              domain: 'test1',
            },
            {
              name: 'test2',
              domain: 'test2',
            },
          ],
        };
        return request(server)
          .post('/companies/bulk')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(201);
            expect(res.body[0].id).toBeTruthy();
            expect(res.body[1].id).toBeTruthy();
          });
      });
    });

    describe('#updateOneBase', () => {
      it('should return status 404', () => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/333')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(404);
          });
      });
      it('should return updated entity, 1', () => {
        const dto = { name: 'updated0' };
        return request(server)
          .patch('/companies/1')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
          });
      });
      it('should return updated entity, 2', () => {
        const dto = { isActive: false, companyId: 5 };
        return request(server)
          .patch('/companies/2/users/20')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.isActive).toBe(false);
            expect(res.body.companyId).toBe(2);
          });
      });
    });

    describe('#replaceOneBase', () => {
      it('should create entity', () => {
        const dto = { name: 'updated0', domain: 'domain0' };
        return request(server)
          .put('/companies/333')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
          });
      });
      it('should return updated entity, 1', () => {
        const dto = { name: 'updated0' };
        return request(server)
          .put('/companies/1')
          .send(dto)
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updated0');
          });
      });
    });

    describe('#deleteOneBase', () => {
      it('should return status 404', () => {
        return request(server)
          .delete('/companies/333')
          .expect((res) => {
            expect(res.status).toBe(404);
          });
      });
      it('should return deleted entity', () => {
        return request(server)
          .delete('/companies/2/users/21')
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(21);
            expect(res.body.companyId).toBe(2);
          });
      });
    });

    describe('join options: required', () => {
      const users2 = () => request(server).get('/users2/21');
      const users3 = () => request(server).get('/users3/21');

      it('should return status 404', async () => {
        await users2().expect(404);
      });

      it('should return status 200', async () => {
        const res = await users3().expect(200);
        expect(res.body.id).toBe(21);
        expect(res.body.profile).toBe(null);
      });
    });
  });
});

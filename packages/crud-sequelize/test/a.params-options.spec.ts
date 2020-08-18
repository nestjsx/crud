import 'jest-extended';
import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import * as request from 'supertest';

import { Company } from '../../../integration/crud-sequelize/companies/company.model';
import { config } from '../../../integration/crud-sequelize/sequelize.config';
import { Project } from '../../../integration/crud-sequelize/projects/project.model';
import { User } from '../../../integration/crud-sequelize/users/user.model';
import { UserProfile } from '../../../integration/crud-sequelize/users-profiles/userprofile.model';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { Crud } from '../../crud/src/decorators/crud.decorator';
import { UsersService } from './__fixture__/users.service';
import { MigrationHelper } from './migration-helper';
import { Sequelize } from 'sequelize';

// tslint:disable:max-classes-per-file
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

  describe('#params options', () => {
    let app: INestApplication;
    let server: any;

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
        updateOneBase: {
          allowParamsOverride: true,
          returnShallow: true,
        },
        replaceOneBase: {
          allowParamsOverride: true,
          returnShallow: true,
        },
      },
    })
    @Controller('/companiesA/:companyId/users')
    class UsersController1 {
      constructor(public service: UsersService) {}
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
      query: {
        join: {
          company: {
            eager: true,
          },
        },
      },
    })
    @Controller('/companiesB/:companyId/users')
    class UsersController2 {
      constructor(public service: UsersService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          SequelizeModule.forRoot({ ...config, logging: false }),
          SequelizeModule.forFeature([Company, Project, User, UserProfile]),
        ],
        controllers: [UsersController1, UsersController2],
        providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }, UsersService],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = app.getHttpServer();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#updateOneBase', () => {
      it('should override params', async () => {
        const dto = { isActive: false, companyId: 2 };
        const res = await request(server)
          .patch('/companiesA/1/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(2);
      });
      it('should not override params', async () => {
        const dto = { isActive: false, companyId: 2 };
        const res = await request(server)
          .patch('/companiesB/1/users/3')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(1);
      });
      it('should return full entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .patch('/companiesB/1/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.company.id).toBe(1);
      });
      it('should return shallow entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .patch('/companiesA/1/users/2')
          .send(dto)
          .expect(200);
        expect(res.body.company).toBeUndefined();
      });
    });

    describe('#replaceOneBase', () => {
      it('should override params', async () => {
        const dto = { isActive: false, companyId: 2, email: '4@email.com' };
        const res = await request(server)
          .put('/companiesA/1/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(2);
      });
      it('should not override params', async () => {
        const dto = { isActive: false, companyId: 2 };
        const res = await request(server)
          .put('/companiesB/1/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.companyId).toBe(1);
      });
      it('should return full entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .put('/companiesB/1/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.company.id).toBe(1);
      });
      it('should return shallow entity', async () => {
        const dto = { isActive: false };
        const res = await request(server)
          .put('/companiesA/1/users/4')
          .send(dto)
          .expect(200);
        expect(res.body.company).toBeUndefined();
      });
    });
  });
});

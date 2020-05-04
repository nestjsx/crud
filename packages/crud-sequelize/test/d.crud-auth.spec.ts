import {
  Controller,
  INestApplication,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';

import { Crud, CrudAuth } from '@nestjsx/crud';
import * as request from 'supertest';
import { config } from '../../../integration/crud-sequelize/sequelize.config';
import { User } from '../../../integration/crud-sequelize/users/user.model';
import { UserProfile } from '../../../integration/crud-sequelize/users-profiles/userprofile.model';
import { Project } from '../../../integration/crud-sequelize/projects/project.model';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
import { UsersService } from './__fixture__/users.service';
import { ProjectsService } from './__fixture__/projects.service';
import { MigrationHelper } from './migration-helper';
import { Sequelize } from 'sequelize';

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

  describe('#CrudAuth', () => {
    const USER_REQUEST_KEY = 'user';
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;

    @Injectable()
    class AuthGuard implements CanActivate {
      constructor(private usersService: UsersService) {}

      async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        req[USER_REQUEST_KEY] = await this.usersService.findOne({ where: { id: 1 } });
        return true;
      }
    }

    @Crud({
      model: {
        type: User,
      },
      routes: {
        only: ['getOneBase', 'updateOneBase'],
      },
      params: {
        id: {
          primary: true,
          disabled: true,
        },
      },
    })
    @CrudAuth({
      property: USER_REQUEST_KEY,
      filter: (user: User) => ({
        id: user.id,
      }),
      persist: (user: User) => ({
        email: user.email,
      }),
    })
    @Controller('me')
    class MeController {
      constructor(public service: UsersService) {}
    }

    @Crud({
      model: {
        type: Project,
      },
      routes: {
        only: ['createOneBase', 'deleteOneBase'],
      },
    })
    @CrudAuth({
      property: USER_REQUEST_KEY,
      filter: (user: User) => ({
        companyId: user.companyId,
      }),
      persist: (user: User) => ({
        companyId: user.companyId,
      }),
    })
    @Controller('projects')
    class ProjectsController {
      constructor(public service: ProjectsService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          SequelizeModule.forRoot({ ...config, logging: false }),
          SequelizeModule.forFeature([User, UserProfile, Project]),
        ],
        controllers: [MeController, ProjectsController],
        providers: [
          { provide: APP_GUARD, useClass: AuthGuard },
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          UsersService,
          ProjectsService,
        ],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = request(app.getHttpServer());
    });

    afterAll(async () => {
      await app.close();
    });

    describe('#getOneBase', () => {
      it('should return a user with id 1', async () => {
        const res = await server.get('/me').expect(200);
        expect(res.body.id).toBe(1);
      });
    });

    describe('#updateOneBase', () => {
      it('should update user with auth persist, 1', async () => {
        const res = await server
          .patch('/me')
          .send({
            email: 'some@dot.com',
            isActive: false,
          })
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.email).toBe('1@email.com');
            expect(res.body.isActive).toBe(false);
          });
      });
      it('should update user with auth persist, 2', async () => {
        const res = await server
          .patch('/me')
          .send({
            email: 'some@dot.com',
            isActive: true,
          })
          .expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.email).toBe('1@email.com');
            expect(res.body.isActive).toBe(true);
          });
      });
    });

    describe('#createOneBase', () => {
      it('should create an entity with auth persist', async () => {
        const res = await server
          .post('/projects')
          .send({
            name: 'Test',
            description: 'foo',
            isActive: false,
            companyId: 10,
          })
          .expect(201);
        expect(res.body.companyId).toBe(1);
      });
    });

    describe('#deleteOneBase', () => {
      it('should delete an entity with auth filter', async () => {
        await server.delete('/projects/1').expect(200);
      });
      it('should throw a 404 error with nonexisting project', async () => {
        await server.delete('/projects/21').expect(404);
      });
      it('should throw a 404 error with company project not associated with user', async () => {
        await server.delete('/projects/20').expect(404);
      });
    });
  });
});

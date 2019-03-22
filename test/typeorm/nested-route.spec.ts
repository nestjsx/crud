import * as request from 'supertest';
import { expect } from 'chai';
import { Test } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Controller, Get, INestApplication, Inject, Injectable, Param } from '@nestjs/common';

import { Company, ormConfig, Task, User, UserProfile } from '../../integration/typeorm/e2e';
import { Crud, Feature, RestfulOptions } from '../../src';
import { RepositoryService } from '../../src/typeorm';

@Injectable()
class CompaniesService extends RepositoryService<Company> {
  protected options: RestfulOptions = {
    persist: ['id'],
    filter: [{ field: 'id', operator: 'notnull' }],
    sort: [{ field: 'id', order: 'ASC' }],
  };

  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}

@Feature('Companies')
@Crud(Company, {
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
  options: {
    cache: 1000,
    filter: [{ field: 'id', operator: 'notnull' }],
    join: {
      users: {
        persist: ['id'],
        exclude: ['password'],
      },
      'users.projects': {
        exclude: ['description'],
      },
      'users.projects.tasks': {
        persist: ['status'],
      },
    },
  },
})
@Controller('companies')
class CompaniesController {
  constructor(public service: CompaniesService) {}
}

@Injectable()
class UserService extends RepositoryService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}

@Feature('Users')
@Crud(User, {
  options: {
    join: {
      company: {},
    },
  },
})
@Controller('users')
class UserController {
  @Inject() service: UserService;
}

describe('Nested query routes', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserProfile, User, Company, Task]),
      ],
      providers: [CompaniesService, UserService],
      controllers: [CompaniesController, UserController],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  it('nested relations', () => {
    return request(server)
      .get('/companies/1?join=users||email&join=users.projects&join=users.projects.tasks')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.nested.property('users[0].projects[0].tasks[0].name');
      });
  });

  it('when missing fields', () => {
    return request(server)
      .get('/companies/1?join=users||email&join=users.projects1&join=users.projects1.tasks')
      .expect(200);
  });

  it('nested filter on one', () => {
    return request(server)
      .get('/users?join=company&filter=company.name||ends||1')
      .expect(200);
  });

  it('nested filter on many', () => {
    return request(server)
      .get('/companies?join=users&join=users.projects&filter=projects.name||starts||project')
      .expect(200);
  });

  it('too many nested levels', () => {
    return request(server)
      .get('/companies?join=users&join=users.projects&filter=users.projects.name||starts||project')
      .expect(400);
  });

  it('missing relation', () => {
    return request(server)
      .get('/companies?join=users&join=users.projects&filter=projects1.name||starts||project')
      .expect(400);
  });

  it('missing fields', () => {
    return request(server)
      .get('/companies?join=users&join=users.projects&filter=projects.name1||starts||project')
      .expect(400);
  });
});

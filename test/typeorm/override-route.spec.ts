import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { INestApplication, Injectable, Controller } from '@nestjs/common';

import { UserProfile, User, Company, ormConfig } from '../../integration/typeorm/e2e';
import { Crud, Override, ParsedOptions, ParsedQuery, CrudOptions, CrudController } from '../../src';
import { RepositoryService } from '../../src/typeorm';

Injectable();
class UsersService extends RepositoryService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}

@Crud(User, {})
@Controller('/companies/:companyId/users')
class UsersController {
  constructor(public service: UsersService) {}

  get base() {
    return this as CrudController<RepositoryService<User>, User>;
  }

  @Override('getManyBase')
  getMany(@ParsedQuery() query, @ParsedOptions() crudOptions: CrudOptions) {
    return this.base.getManyBase(query, crudOptions);
  }

  @Override()
  async getOne(@ParsedQuery() query, @ParsedOptions() crudOptions: CrudOptions) {
    return this.base.getOneBase(query, crudOptions);
  }
}

describe('Override base routes', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserProfile, User, Company]),
      ],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('get many', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/companies/1/users')
        .expect(200);
    });
  });

  describe('get one', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/companies/1/users/1')
        .expect(200);
    });

    it('should return status 404', () => {
      return request(server)
        .get('/companies/1/users/1806')
        .expect(404);
    });
  });
});

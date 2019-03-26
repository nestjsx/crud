import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { INestApplication, Injectable, Controller, Get } from '@nestjs/common';

import {
  UserProfile,
  User,
  Company,
  Task,
  Project,
  ormConfig,
} from '../../integration/typeorm/e2e';
import {
  Crud,
  ParsedQuery,
  ParsedParams,
  RestfulParamsDto,
  UsePathInterceptors,
  ParsedOptions,
  RestfulOptions,
} from '../../src';
import { RepositoryService } from '../../src/typeorm';

@Injectable()
class CompaniesService extends RepositoryService<Company> {
  protected options: RestfulOptions = {};

  constructor(@InjectRepository(Company) public repo) {
    super(repo);
  }
}

@Crud(Company, {
  params: {
    id: 'uuid',
  },
})
@UsePathInterceptors()
@Controller('custom2')
class Custom2Controller {
  constructor(public service: CompaniesService) {}

  @Get('with/all')
  customWithAll(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedParams() params,
    @ParsedOptions() options,
  ) {
    return { query, params, options };
  }

  @Get('repo/find-one')
  async customFindOne() {
    return this.service.findOne(1);
  }

  @Get('repo/find')
  async customFind() {
    return this.service.find({ id: 1 });
  }
}

@Crud(Company, {})
@Controller('custom1')
class Custom1Controller {
  constructor(public service: CompaniesService) {}

  @UsePathInterceptors('query')
  @Get('with/query')
  customWithQuery(@ParsedQuery() query: RestfulParamsDto) {
    return query;
  }

  @UsePathInterceptors('param')
  @Get('with/param')
  customWithParam(@ParsedParams() params) {
    return params;
  }

  @UsePathInterceptors()
  @Get('with/all1')
  customWithAll1(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedParams() params,
    @ParsedOptions() options,
  ) {
    return { query, params, options };
  }

  @UsePathInterceptors('param', 'query')
  @Get('with/all2')
  customWithAll2(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedParams() params,
    @ParsedOptions() options,
  ) {
    return { query, params, options };
  }
}

describe('Custom routes with @UsePathInterceptors()', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserProfile, User, Task, Project, Company]),
      ],
      providers: [CompaniesService],
      exports: [CompaniesService],
      controllers: [Custom1Controller, Custom2Controller],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('get custom route with query', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/custom1/with/query')
        .query({
          fields: 'name',
          filter: 'name||eq||foo',
          join: 'users',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('fields');
          expect(res.body).toHaveProperty('filter');
          expect(res.body).toHaveProperty('join');
        });
    });
  });

  describe('get custom route with param', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/custom1/with/param')
        .expect(200);
    });
  });

  describe('get custom route with all', () => {
    const test = (path: string) =>
      request(server)
        .get(path)
        .query({
          fields: 'name',
          filter: 'name||eq||foo',
          join: 'users',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('query.fields');
          expect(res.body).toHaveProperty('query.filter');
          expect(res.body).toHaveProperty('query.join');
          expect(res.body).toHaveProperty('options');
          expect(res.body).toHaveProperty('params');
        });

    it('should return status 200, 1/3', () => {
      return test('/custom1/with/all1');
    });

    it('should return status 200, 2/3', () => {
      return test('/custom1/with/all2');
    });

    it('should return status 200, 3/3', () => {
      return test('/custom2/with/all');
    });
  });

  describe('get custom service findOne', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/custom2/repo/find-one')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.id).toBe(1);
        });
    });
  });

  describe('get custom service find', () => {
    it('should return status 200', () => {
      return request(server)
        .get('/custom2/repo/find')
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).not.toBeFalsy();
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0].id).toBe(1);
        });
    });
  });

  describe('test params validation', () => {
    it('should return status 400', () => {
      return request(server)
        .get('/custom2/invalid')
        .expect(400);
    });

    it('should return status 500', () => {
      return request(server)
        .get('/custom2/12876db5-1754-4864-96e6-c3c78f85d151')
        .expect(500);
    });
  });
});

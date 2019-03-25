import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { INestApplication, Injectable, Controller, Get } from '@nestjs/common';

import { UserProfile, User, Company, ormConfig } from '../../integration/typeorm/e2e';
import {
  Crud,
  ParsedQuery,
  ParsedParams,
  RestfulParamsDto,
  UsePathInterceptors,
  ParsedOptions,
} from '../../src';
import { RepositoryService } from '../../src/typeorm';

@Injectable()
class CompaniesService extends RepositoryService<Company> {
  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}

@Crud(Company, {})
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
        TypeOrmModule.forFeature([UserProfile, User, Company]),
      ],
      providers: [CompaniesService],
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
});

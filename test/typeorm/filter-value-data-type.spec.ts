import * as supertest from 'supertest';
import * as _ from 'lodash';
import { Test } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Controller, Get, INestApplication, Injectable } from '@nestjs/common';

import { Company, ormConfig, User, UserProfile } from '../../integration/typeorm/e2e';
import { Crud, ParsedQuery, RestfulParamsDto, UsePathInterceptors } from '../../src';
import { RepositoryService } from '../../src/typeorm';
import { FilterParamDto } from '../../src/dto/filter-param.dto';

@Injectable()
class CompaniesService extends RepositoryService<Company> {
  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}

@Crud(Company)
@Controller('companies')
class CompaniesController {
  constructor(public service: CompaniesService) {
  }

  @UsePathInterceptors('query')
  @Get('test')
  async test(@ParsedQuery() query: RestfulParamsDto) {
    return query;
  }
}

describe('filter value parse', () => {
  let app: INestApplication;
  let $: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserProfile, User, Company]),
      ],
      providers: [CompaniesService],
      controllers: [CompaniesController],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
    const server = app.getHttpServer();
    $ = supertest(server);
  });

  afterAll(async () => {
    await app.close();
  });

  function check(filters: FilterParamDto[], field: string, expectValue: any) {
    const realValue = _.chain(filters).find({ field }).get('value').value();
    expect(realValue).toEqual(expectValue);
  }

  it('should parse int', async () => {
    const res = await $.get('/companies/test')
      .query({
        v1: '12345',
        v2: -234,
        filter: 'v3||in||1e3,-666',
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', 12345);
    check(filters, 'v2', -234);
    check(filters, 'v3', [1e3, -666]);
  });

  it('should parse bool', async () => {
    const res = await $.get('/companies/test')
      .query({
        v1: true,
        v2: false,
        filter: 'v3||in||true,false',
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', true);
    check(filters, 'v2', false);
    check(filters, 'v3', [true, false]);
  });

  it('should parse null', async () => {
    const res = await $.get('/companies/test')
      .query({
        v1: 'null',
        filter: ['v2||eq||null', 'v3||in||null,null'],
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', null);
    check(filters, 'v2', null);
    check(filters, 'v3', [null, null]);
  });

  it('should parse float', async () => {
    const res = await $.get('/companies/test')
      .query({
        v1: '1.4',
        filter: ['v2||eq||3.6', 'v3||in||4.66,-5.08'],
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', 1.4);
    check(filters, 'v2', 3.6);
    check(filters, 'v3', [4.66, -5.08]);
  });

  it('should keep json string', async () => {
    const jsonString = JSON.stringify({ a: 2, b: 3 });
    const jsonString2 = JSON.stringify([3, 4, 5, 6]);
    const jsonString3 = JSON.stringify([3, { a: 5 }, 5, [2, 3]]);
    const res = await $.get('/companies/test')
      .query({
        v1: jsonString,
        v2: jsonString2,
        filter: 'v3||eq||' + jsonString3,
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', jsonString);
    check(filters, 'v2', jsonString2);
    check(filters, 'v3', jsonString3);
  });

  it('should keep string', async () => {
    const res = await $.get('/companies/test')
      .query({
        v1: '2019-01-01T00:00:00Z',
        v2: '"123"',
        filter: 'v3||in||"123.33","true"',
      })
      .expect(200);

    const filters = (res.body as RestfulParamsDto).filter;

    check(filters, 'v1', '2019-01-01T00:00:00Z');
    check(filters, 'v2', '123');
    check(filters, 'v3', ['123.33', 'true']);
  });

});

import * as request from 'supertest';
import { expect } from 'chai';
import { Test } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Controller, Get, INestApplication, Injectable, Param } from '@nestjs/common';

import { Company, ormConfig, User, UserProfile } from '../../integration/typeorm/e2e';
import { Action, Crud, CrudController, Feature, Override, RestfulOptions } from '../../src';
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
  options: {
    cache: 1000,
    filter: [{ field: 'id', operator: 'notnull' }],
    join: {
      'users': {
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
class CompaniesController implements CrudController<CompaniesService, Company> {
  constructor(public service: CompaniesService) {
  }

  @Action('test')
  @Get('test')
  test() {
    return 'ok';
  }

  @Override()
  deleteOne(@Param('id') id, @Param() params) {
    return (this as any).deleteOneBase(id, params);
  }
}

describe('Simple base routes', () => {
  let app: INestApplication;
  let server: any;

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
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  // Get Many

  describe('', () => {
  });

  it('/GET / (200)', () => {
    return request(server)
      .get('/companies')
      .expect(200);
  });

  it('/GET ?cache=0 (200)', () => {
    return request(server)
      .get('/companies?cache=0')
      .expect(200);
  });

  it('/GET ?fields=name (200)', () => {
    return request(server)
      .get('/companies?fields=name')
      .expect(200);
  });

  it('/GET ?fields=name,id (200)', () => {
    return request(server)
      .get('/companies?fields=name')
      .expect(200);
  });

  it('/GET ?limit=5 (200)', () => {
    return request(server)
      .get('/companies?limit=5')
      .expect(200);
  });

  it('/GET ?limit=2&page=3 (200)', () => {
    return request(server)
      .get('/companies?limit=2&page=3')
      .expect(200);
  });

  it('/GET ?offset=5 (200)', () => {
    return request(server)
      .get('/companies?offset=5')
      .expect(200);
  });

  it('/GET ?filter=domain||ne||test1 (200)', () => {
    return request(server)
      .get('/companies?filter=domain||ne||test1')
      .expect(200);
  });

  it('/GET ?or=domain||ne||test1 (200)', () => {
    return request(server)
      .get('/companies?or=domain||ne||test1')
      .expect(200);
  });

  it('/GET ?or=domain||eq||test1&or=domain||eq||test2 (200)', () => {
    return request(server)
      .get('/companies?or=domain||eq||test1&or=domain||eq||test2')
      .expect(200);
  });

  it('/GET ?or=domain||eq||test1&filter=domain||eq||test2 (200)', () => {
    return request(server)
      .get('/companies?or=domain||eq||test1&filter=domain||eq||test2')
      .expect(200);
  });

  it('/GET ?or=domain||eq||test1&or=name||notnull&filter=domain||eq||test2 (200)', () => {
    return request(server)
      .get('/companies?or=domain||eq||test1&or=name||notnull&filter=domain||eq||test2')
      .expect(200);
  });

  it('/GET ?filter=domain||eq||test1&filter=name||notnull&or=domain||eq||test2&or=name||cont||Test2 (200)', () => {
    return request(server)
      .get(
        '/companies?filter=domain||eq||test1&filter=name||notnull&or=domain||eq||test2&or=name||cont||Test2',
      )
      .expect(200);
  });

  it('/GET ?or=domain||eq||test1&filter=name||notnull&filter=domain||eq||test2 (200)', () => {
    return request(server)
      .get('/companies?or=domain||eq||test1&filter=name||notnull&filter=domain||eq||test2')
      .expect(200);
  });

  it('/GET ?join=users (200)', () => {
    return request(server)
      .get('/companies?join=users')
      .expect(200);
  });

  it('/GET ?join=users||email (200)', () => {
    return request(server)
      .get('/companies?join=users||email')
      .expect(200);
  });

  it('/GET ?sort=name,DESC (200)', () => {
    return request(server)
      .get('/companies?sort=name,DESC')
      .expect(200);
  });

  it('/GET ?sort=name||DESC (400)', () => {
    return request(server)
      .get('/companies?sort=name||DESC')
      .expect(400);
  });

  it('/GET ?domain=test5 (200)', () => {
    return request(server)
      .get('/companies?domain=test5')
      .expect(200);
  });

  it('/GET ?filter=id||in||1,2,3 (200)', () => {
    return request(server)
      .get('/companies?filter=id||in||1,2,3')
      .expect(200);
  });

  it('/GET ?filter=foo||in||1,2,3 (400)', () => {
    return request(server)
      .get('/companies?filter=foo||in||1,2,3')
      .expect(400);
  });

  it('/GET ?filter=id||gt||1 (200)', () => {
    return request(server)
      .get('/companies?filter=id||gt||1')
      .expect(200);
  });

  it('/GET ?filter=id||lt||5 (200)', () => {
    return request(server)
      .get('/companies?filter=id||lt||5')
      .expect(200);
  });

  it('/GET ?filter=id||gte||1 (200)', () => {
    return request(server)
      .get('/companies?filter=id||gte||1')
      .expect(200);
  });

  it('/GET ?filter=id||lte||5 (200)', () => {
    return request(server)
      .get('/companies?filter=id||lte||5')
      .expect(200);
  });

  it('/GET ?filter=name||starts||T (200)', () => {
    return request(server)
      .get('/companies?filter=name||starts||T')
      .expect(200);
  });

  it('/GET ?filter=name||ends||4 (200)', () => {
    return request(server)
      .get('/companies?filter=name||ends||4')
      .expect(200);
  });

  it('/GET ?filter=name||excl||5 (200)', () => {
    return request(server)
      .get('/companies?filter=name||excl||5')
      .expect(200);
  });

  it('/GET ?filter=description||isnull (200)', () => {
    return request(server)
      .get('/companies?filter=description||isnull')
      .expect(200);
  });

  it('/GET ?filter=id||notin||500,501 (200)', () => {
    return request(server)
      .get('/companies?filter=id||notin||500,501')
      .expect(200);
  });

  it('/GET ?filter=id||between||1,5 (200)', () => {
    return request(server)
      .get('/companies?filter=id||between||1,5')
      .expect(200);
  });

  it('/GET ?filter=id||in|| (400)', () => {
    return request(server)
      .get('/companies?filter=id||in||')
      .expect(400);
  });

  it('/GET ?filter=id||notin|| (400)', () => {
    return request(server)
      .get('/companies?filter=id||notin||')
      .expect(400);
  });

  it('/GET ?filter=id||between|| (400)', () => {
    return request(server)
      .get('/companies?filter=id||between||')
      .expect(400);
  });

  it('/GET ?filter=id||between||4 (400)', () => {
    return request(server)
      .get('/companies?filter=id||between||4')
      .expect(400);
  });

  // Get One

  it('/GET /1 (200)', () => {
    return request(server)
      .get('/companies/1')
      .expect(200);
  });

  it('/GET /foo (400)', () => {
    return request(server)
      .get('/companies/foo')
      .expect(400);
  });

  it('/GET /345 (404)', () => {
    return request(server)
      .get('/companies/345')
      .expect(404);
  });

  // Create One

  it('/POST (201)', () => {
    const data = { name: 'e2eName0', domain: 'e2eDomain0' } as Company;
    return request(server)
      .post('/companies')
      .send(data)
      .expect(201);
  });

  it('/POST (400)', () => {
    return request(server)
      .post('/companies')
      .send({})
      .expect(400);
  });

  it('/POST (400)', () => {
    const data = { name: 123 };
    return request(server)
      .post('/companies')
      .send(data)
      .expect(400);
  });

  // Create Many

  it('/POST bulk (201)', () => {
    const data = {
      bulk: [
        { name: 'e2eName1', domain: 'e2eDomain1' },
        { name: 'e2eName2', domain: 'e2eDomain2' },
        { name: 'e2eName3', domain: 'e2eDomain3' },
      ],
    };
    return request(server)
      .post('/companies/bulk')
      .send(data)
      .expect(201);
  });

  // Update One

  it('/PATCH (404)', () => {
    return request(server)
      .patch('/companies/123')
      .send({})
      .expect(404);
  });

  it('/PATCH (200)', () => {
    return request(server)
      .patch('/companies/1')
      .send({})
      .expect(200);
  });

  it('/PATCH (200)', () => {
    const data = { name: 'updatedName' };
    return request(server)
      .patch('/companies/1')
      .send(data)
      .expect(200);
  });

  // Delete One

  it('/DELETE (200)', () => {
    return request(server)
      .delete('/companies/11')
      .expect(200);
  });

  // Custom routes

  it('/GET /test (200)', () => {
    return request(server)
      .get('/companies/test')
      .expect(200);
  });

});

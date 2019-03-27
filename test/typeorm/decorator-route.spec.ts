import { Controller, Get, INestApplication, Injectable, SetMetadata } from '@nestjs/common';
import { Company, ormConfig, Project, Task, User, UserProfile } from '../../integration/typeorm/e2e';
import { Crud, forTypeORM, RestfulOptions } from '../../src/';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { EntityManager, MoreThan } from 'typeorm';
import RepositoryService = forTypeORM.RepositoryService;

let decoratorWorks = false;
let called = 0;

function TestDecorator(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const original = descriptor.value;
    // tslint:disable-next-line:only-arrow-functions
    descriptor.value = function(...args) {
      decoratorWorks = true;
      called++;
      return original.apply(this, args);
    };

    return descriptor;
  };
}

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

@Crud(Company, {
  routes: {
    getManyBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
    getOneBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
    createOneBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
    createManyBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
    updateOneBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
    deleteOneBase: {
      decorators: [
        TestDecorator(),
        SetMetadata('test', true),
      ],
    },
  },
})
@Controller('companies')
class CompaniesController {
  constructor(public service: CompaniesService) {
  }

  @SetMetadata('test', true)
  @Get('test')
  @TestDecorator()
  test() {
    return {};
  }
}

describe('custom decorators', () => {

  let app: INestApplication;
  let $: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserProfile, User, Task, Project, Company]),
      ],
      providers: [CompaniesService],
      exports: [CompaniesService],
      controllers: [CompaniesController],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
    $ = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await (app.get(EntityManager) as EntityManager).delete(Company, { id: MoreThan(11) });
    await app.close();
  });

  beforeEach(() => {
    decoratorWorks = false;
    called = 0;
  });

  it('custom decorator should work', async () => {
    const definedValue = Reflect.getMetadata('test', CompaniesController.prototype.test);
    expect(definedValue).toBeTruthy();

    await $.get('/companies/test').expect(200);
    expect(decoratorWorks).toBeTruthy();
  });

  ['getManyBase', 'getOneBase', 'createOneBase', 'createManyBase', 'updateOneBase', 'deleteOneBase'].forEach((methodName) => {
    it(`metadata decorator on ${methodName} works`, async () => {
      const definedValue = Reflect.getMetadata('test', CompaniesController.prototype[methodName]);
      expect(definedValue).toBeTruthy();
    });
  });

  it(`proxy decorator on getManyBase works`, async () => {
    await $.get('/companies').expect(200);
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });

  it(`proxy decorator on getOneBase works`, async () => {
    await $.get('/companies/1').expect(200);
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });

  it(`proxy decorator on createOneBase works`, async () => {
    await $.post('/companies').send({ name: 'Test11', domain: 'Test11' }).expect(201);
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });

  it(`proxy decorator on createManyBase works`, async () => {
    await $.post('/companies/bulk').send({
      bulk: [{ name: 'Test12', domain: 'Test12' }, { name: 'Test13', domain: 'Test13' }],
    }).expect(201);
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });

  it(`proxy decorator on updateOneBase works`, async () => {
    await $.patch('/companies/1').send({ description: 'test' });
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });

  it(`proxy decorator on deleteOneBase works`, async () => {
    await $.del('/companies/100');
    expect(decoratorWorks).toBeTruthy();
    expect(called).toEqual(1);
  });
});

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { INestApplication, Injectable, Controller } from '@nestjs/common';

import { UserProfile, User, Company, ormConfig } from '../../integration/typeorm/e2e';
import { Crud, RestfulOptions } from '../../src';
import { RepositoryService } from '../../src/typeorm';

@Injectable()
class UsersService extends RepositoryService<User> {
  protected options: RestfulOptions = {
    limit: 10,
    maxLimit: 20,
  };

  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}

@Crud(User, {})
@Controller('/companies/:companyId/users')
class UsersController {
  constructor(public service: UsersService) {}
}

describe('Filtered base routes', () => {
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
        .get('/companies/1/users/18')
        .expect(404);
    });
  });

  describe('create one', () => {
    it('should return status 400', () => {
      return request(server)
        .post('/companies/1/users')
        .expect(400);
    });

    it('should return status 400', () => {
      return request(server)
        .post('/companies/1/users')
        .send({})
        .expect(400);
    });

    it('should return status 400', () => {
      const data = {
        email: 'test@e2e.io',
        password: 'password',
        isActive: false,
        profile: {
          firstName: false,
          lastName: 123,
        },
      } as any;
      return request(server)
        .post('/companies/1/users')
        .send(data)
        .expect(400);
    });

    it('should return status 201', () => {
      const data = {
        email: 'test@e2e.io',
        password: 'password',
        isActive: false,
        profile: {},
      } as User;
      return request(server)
        .post('/companies/1/users')
        .send(data)
        .expect(201);
    });
  });

  describe('create many', () => {
    it('should return status 400', () => {
      return request(server)
        .post('/companies/1/users/bulk')
        .send({})
        .expect(400);
    });

    it('should return status 400', () => {
      return request(server)
        .post('/companies/1/users/bulk')
        .send({ bulk: [] })
        .expect(400);
    });

    it('should return status 201', () => {
      const data = {
        bulk: [
          {
            email: 'test1@e2e.io',
            password: 'password',
            isActive: false,
            profile: {},
          } as User,
          {
            email: 'test2@e2e.io',
            password: 'password',
            isActive: true,
            profile: {},
          } as User,
        ],
      };
      return request(server)
        .post('/companies/1/users/bulk')
        .send(data)
        .expect(201);
    });
  });

  describe('update one', () => {
    it('should return status 404', () => {
      return request(server)
        .patch('/companies/1/users/67')
        .send({ password: 'empty' })
        .expect(404);
    });

    it('should return status 404', () => {
      return request(server)
        .patch('/companies/2/users/2')
        .send({ password: 'empty' })
        .expect(404);
    });

    it('should return status 200', () => {
      return request(server)
        .patch('/companies/2/users/12')
        .send({ password: 'empty' })
        .expect(200);
    });
  });

  describe('delete one', () => {
    it('should return status 404', () => {
      return request(server)
        .delete('/companies/2/users/2')
        .expect(404);
    });
  });
});

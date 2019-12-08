import { Controller, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { Crud } from '@nestjsx/crud';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { commentSchema } from '../../../integration/crud-mongoose/comments';
import {
  MONGO_CONFIG,
  MONGO_URI,
} from '../../../integration/crud-mongoose/mongoose.config';
import { postSchema } from '../../../integration/crud-mongoose/posts';
import { seedUsers } from '../../../integration/crud-mongoose/seeds';
import { User } from '../../../integration/crud-mongoose/users';
import { UserDocument } from '../../../integration/crud-mongoose/users/user.document';
import { userSchema } from '../../../integration/crud-mongoose/users/user.schema';
import { UsersService } from './__fixture__/users.service';

// tslint:disable:max-classes-per-file no-shadowed-variable
describe('#crud-mongoose', () => {
  describe('#basic crud', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;
    let service: UsersService;
    let model: Model<UserDocument>;

    @Crud({
      model: { type: User },
      params: {
        id: {
          field: '_id',
          type: 'string',
          primary: true,
        },
      },
      routes: {
        deleteOneBase: {
          returnDeleted: true,
        },
      },
    })
    @Controller('users')
    class UsersController {
      constructor(public service: UsersService) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(MONGO_URI, MONGO_CONFIG),
          MongooseModule.forFeature([
            { name: 'User', schema: userSchema },
            { name: 'Comment', schema: commentSchema },
            { name: 'Post', schema: postSchema },
          ]),
        ],
        controllers: [UsersController],
        providers: [UsersService],
      }).compile();

      app = fixture.createNestApplication();
      service = app.get<UsersService>(UsersService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(async () => {
      qb = RequestQueryBuilder.create();
      model = service.repo;
      await model.deleteMany({});
      await model.create(seedUsers);
    });

    afterAll(async () => {
      await model.deleteMany({});
      await app.close();
    });

    describe('#find', () => {
      it('should return entities', async () => {
        const data = await service.find();
        expect(data.length).toBe(9);
      });
    });

    describe('#findOne', () => {
      it('should return one entity', async () => {
        const data = await service.findOne({ name: 'jay' });
        expect(data.id).toBe('5de34417cd5e475f96a46583');
      });
    });

    describe('#findById', () => {
      it('should return one entity', async () => {
        const data = await service.findById('5de34417cd5e475f96a46583');
        expect(data.name).toBe('jay');
      });
    });

    describe('buildFieldSelect', () => {
      it('should overwrite includes with excludes', () => {
        const includes = ['id', 'name', 'title'];
        const excludes = ['name'];
        expect(service.buildFieldSelect(includes, excludes)).toEqual('id title -name');
      });

      it('should return all allowed', () => {
        const includes = ['id', 'name', 'title'];
        const excludes = [];
        expect(service.buildFieldSelect(includes, excludes)).toEqual('id name title');
      });

      it('should return all allowed if excludes is nil', () => {
        const includes = ['id', 'name', 'title'];
        const excludes = undefined;
        expect(service.buildFieldSelect(includes, excludes)).toEqual('id name title');
      });
    });

    describe('buildNestedVirtualPopulate', () => {
      it('should build single level populate', () => {
        expect(service.buildNestedVirtualPopulate('posts', 'title')).toEqual({
          path: 'posts',
          select: 'title',
        });
      });

      it('should build multi level populate', () => {
        expect(service.buildNestedVirtualPopulate('posts.comments', 'title')).toEqual({
          path: 'posts',
          populate: {
            path: 'comments',
            select: 'title',
          },
        });
      });

      it('should stop at non existent virtual', () => {
        expect(service.buildNestedVirtualPopulate('posts.wrong', 'title')).toEqual({
          path: 'posts',
          select: 'title',
        });
      });
    });

    describe('#getAllBase', () => {
      it('should return an array of all entities', (done) => {
        return request(server)
          .get('/users')
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(9);
            done();
          });
      });

      it('should return an entities with limit', (done) => {
        const query = qb.setLimit(5).query();
        return request(server)
          .get('/users')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(5);
            done();
          });
      });

      it('should return an entities with limit and page', (done) => {
        const query = qb
          .setLimit(3)
          .setPage(1)
          .sortBy({ field: '_id', order: 'DESC' })
          .query();
        return request(server)
          .get('/users')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.count).toBe(3);
            expect(res.body.total).toBe(9);
            expect(res.body.page).toBe(1);
            expect(res.body.pageCount).toBe(3);
            done();
          });
      });

      it('should return an entities with offset', (done) => {
        const query = qb.setOffset(3).query();
        return request(server)
          .get('/users')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(6);
            done();
          });
      });

      describe('#getOneBase', () => {
        it('should return status 404', (done) => {
          return request(server)
            .get('/users/6de34417cd5e475f96a46583')
            .end((_, res) => {
              // console.error(res.body);
              expect(res.status).toBe(404);
              done();
            });
        });
        it('should return an entity, 5de34417cd5e475f96a46583', (done) => {
          return request(server)
            .get('/users/5de34417cd5e475f96a46583')
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body._id).toBe('5de34417cd5e475f96a46583');
              done();
            });
        });
        it('should return an entity, 2', (done) => {
          const query = qb.select(['name']).query();
          return request(server)
            .get('/users/5de34417cd5e475f96a46583')
            .query(query)
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body._id).toBe('5de34417cd5e475f96a46583');
              expect(res.body.name).toBeTruthy();
              done();
            });
        });
      });

      describe('#createOneBase', () => {
        it('should return status 400', (done) => {
          return request(server)
            .post('/users')
            .send('')
            .end((_, res) => {
              expect(res.status).toBe(400);
              done();
            });
        });
        it('should return saved entity', (done) => {
          const dto = {
            name: 'test0',
          };
          return request(server)
            .post('/users')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(201);
              expect(res.body._id).toBeTruthy();
              done();
            });
        });
        it('should return saved entity with param', (done) => {
          const dto: any = {
            name: 'test1',
          };
          return request(server)
            .post('/users')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(201);
              expect(res.body._id).toBeTruthy();
              expect(res.body.name).toBe('test1');
              done();
            });
        });
      });

      describe('#createManyBase', () => {
        it('should return status 400', (done) => {
          const dto = { bulk: [] };
          return request(server)
            .post('/users/bulk')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(400);
              done();
            });
        });

        it('should return created entities', (done) => {
          const dto = {
            bulk: [
              {
                name: 'test1',
              },
              {
                name: 'test2',
              },
            ],
          };
          return request(server)
            .post('/users/bulk')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(201);
              expect(res.body[0]._id).toBeTruthy();
              expect(res.body[1]._id).toBeTruthy();
              done();
            });
        });
      });

      describe('#updateOneBase', () => {
        it('should return status 404', (done) => {
          const dto = { name: 'updated0' };
          return request(server)
            .patch('/users/6de34417cd5e475f96a46583')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(404);
              done();
            });
        });
        it('should return updated entity, 1', (done) => {
          const dto = { name: 'updated0' };
          return request(server)
            .patch('/users/5de34417cd5e475f96a46583')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body.name).toBe('updated0');
              done();
            });
        });
        it('should return updated entity, 2', (done) => {
          const dto = { email: 'test@test.com' };
          return request(server)
            .patch('/users/5de34417cd5e475f96a46583')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body.email).toBe('test@test.com');
              done();
            });
        });
      });

      describe('#replaceOneBase', () => {
        it('should create entity', (done) => {
          const dto = { name: 'updated0', email: 'test@test.com' };
          return request(server)
            .put('/users/5de34417cd5e475f96a46583')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body.name).toBe('updated0');
              done();
            });
        });
        it('should return updated entity, 1', (done) => {
          const dto = { name: 'updated0' };
          return request(server)
            .put('/users/5de34417cd5e475f96a46584')
            .send(dto)
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body.name).toBe('updated0');
              done();
            });
        });
      });

      describe('#deleteOneBase', () => {
        it('should return status 404', (done) => {
          return request(server)
            .delete('/users/6de34417cd5e475f96a46591')
            .end((_, res) => {
              expect(res.status).toBe(404);
              done();
            });
        });
        it('should return deleted entity', (done) => {
          return request(server)
            .delete('/users/5de34417cd5e475f96a46591')
            .end((_, res) => {
              expect(res.status).toBe(200);
              expect(res.body._id).toBe('5de34417cd5e475f96a46591');
              done();
            });
        });
      });
    });
  });
});

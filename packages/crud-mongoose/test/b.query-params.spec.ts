import { Controller, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import 'jest-extended';
import { Model } from 'mongoose';
import * as request from 'supertest';
import {
  CommentDocument,
  commentSchema,
  CommentsService,
} from '../../../integration/crud-mongoose/comments';
import {
  MONGO_CONFIG,
  MONGO_URI,
} from '../../../integration/crud-mongoose/mongoose.config';
import {
  PostDocument,
  postSchema,
  PostsService,
} from '../../../integration/crud-mongoose/posts';
import {
  seedComments,
  seedPosts,
  seedUsers,
} from '../../../integration/crud-mongoose/seeds';
import { User } from '../../../integration/crud-mongoose/users';
import { UserDocument } from '../../../integration/crud-mongoose/users/user.document';
import { userSchema } from '../../../integration/crud-mongoose/users/user.schema';
import { Crud } from '../../crud/src/decorators';
import { UsersService } from './__fixture__/users.service';

// tslint:disable:max-classes-per-file
describe('#crud-typeorm', () => {
  describe('#query params', () => {
    let app: INestApplication;
    let server: any;
    let qb: RequestQueryBuilder;

    let userService: UsersService;
    let postsService: PostsService;
    let commentsService: CommentsService;
    let userModel: Model<UserDocument>;
    let postsModel: Model<PostDocument>;
    let commentsModel: Model<CommentDocument>;

    @Crud({
      model: { type: User },
      params: {
        id: {
          field: '_id',
          type: 'string',
          primary: true,
        },
      },
      query: {
        exclude: ['updatedAt'],
        allow: ['name', 'email'],
        join: {
          posts: {
            allow: ['id'],
          },
          comments: {},
          'posts.comments': {},
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
            { name: 'Post', schema: postSchema },
            { name: 'Comment', schema: commentSchema },
          ]),
        ],
        controllers: [UsersController],
        providers: [UsersService, PostsService, CommentsService],
      }).compile();

      app = fixture.createNestApplication();
      userService = app.get<UsersService>(UsersService);
      postsService = app.get<PostsService>(PostsService);
      commentsService = app.get<CommentsService>(CommentsService);

      await app.init();
      server = app.getHttpServer();
    });

    beforeEach(async () => {
      qb = RequestQueryBuilder.create();
      userModel = userService.repo;
      await userModel.deleteMany({});
      await userModel.create(seedUsers);
      postsModel = postsService.repo;
      await postsModel.deleteMany({});
      await postsModel.create(seedPosts);
      commentsModel = commentsService.repo;
      await commentsModel.deleteMany({});
      await commentsModel.create(seedComments);
    });

    afterAll(async () => {
      await userModel.deleteMany({});
      await postsModel.deleteMany({});
      await app.close();
    });

    // describe('#select', () => {
    //   it('should throw status 400', (done) => {
    //     const query = qb.setFilter({ field: 'invalid', operator: 'isnull' }).query();
    //     return request(server)
    //       .get('/companies')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(500);
    //         done();
    //       });
    //   });
    // });
    //
    // describe('#query filter', () => {
    //   it('should return data with limit', (done) => {
    //     const query = qb.setLimit(4).query();
    //     return request(server)
    //       .get('/companies')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(4);
    //         res.body.forEach((e: Company) => {
    //           expect(e.id).not.toBe(1);
    //         });
    //         done();
    //       });
    //   });
    //   it('should return with maxLimit', (done) => {
    //     const query = qb.setLimit(7).query();
    //     return request(server)
    //       .get('/companies')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(5);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 1', (done) => {
    //     const query = qb
    //       .setFilter({ field: 'name', operator: 'notin', value: ['Name2', 'Name3'] })
    //       .setOr({ field: 'domain', operator: 'cont', value: 5 })
    //       .query();
    //     return request(server)
    //       .get('/companies')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(5);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 2', (done) => {
    //     const query = qb
    //       .setFilter({ field: 'name', operator: 'ends', value: 'foo' })
    //       .setOr({ field: 'name', operator: 'starts', value: 'P' })
    //       .setOr({ field: 'isActive', operator: 'eq', value: true })
    //       .query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(10);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 3', (done) => {
    //     const query = qb
    //       .setOr({ field: 'companyId', operator: 'gt', value: 22 })
    //       .setFilter({ field: 'companyId', operator: 'gte', value: 6 })
    //       .setFilter({ field: 'companyId', operator: 'lt', value: 10 })
    //       .query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(8);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 4', (done) => {
    //     const query = qb
    //       .setOr({ field: 'companyId', operator: 'in', value: [6, 10] })
    //       .setOr({ field: 'companyId', operator: 'lte', value: 10 })
    //       .setFilter({ field: 'isActive', operator: 'eq', value: false })
    //       .setFilter({ field: 'description', operator: 'notnull' })
    //       .query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(10);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 6', (done) => {
    //     const query = qb.setOr({ field: 'companyId', operator: 'isnull' }).query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(0);
    //         done();
    //       });
    //   });
    //   it('should return with filter and or, 6', (done) => {
    //     const query = qb
    //       .setOr({ field: 'companyId', operator: 'between', value: [1, 5] })
    //       .query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(10);
    //         done();
    //       });
    //   });
    //   it('should return with filter, 1', (done) => {
    //     const query = qb.setOr({ field: 'companyId', operator: 'eq', value: 1 }).query();
    //     return request(server)
    //       .get('/projects')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(2);
    //         done();
    //       });
    //   });
    // });
    //
    describe('#query join', () => {
      it('should return joined entity, 1', (done) => {
        const query = qb.setJoin({ field: 'posts', select: ['title'] }).query();

        const post = seedPosts.find((p) => p.id === '1');

        return request(server)
          .get('/users/5de34417cd5e475f96a46583')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.posts).toEqual([
              {
                _id: post._id,
                userId: '5de34417cd5e475f96a46583',
                title: post.title,
              },
            ]);
            done();
          });
      });

      it('should return joined entity, 2', (done) => {
        const query = qb.setJoin({ field: 'comments', select: ['title'] }).query();

        return request(server)
          .get('/users/5de34417cd5e475f96a46583')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.comments.length).toBe(1);
            done();
          });
      });

      it('should return joined nested entity, 1', (done) => {
        const query = qb.setJoin({ field: 'posts.comments', select: ['title'] }).query();

        return request(server)
          .get('/users/5de34417cd5e475f96a46583')
          .query(query)
          .end((_, res) => {
            expect(res.status).toBe(200);
            expect(res.body.posts.length).toBe(1);
            expect(res.body.posts[0].comments.length).toBe(1);
            done();
          });
      });
      // it('should return joined entity, 2', (done) => {
      //   const query = qb.setJoin({ field: 'users', select: ['name'] }).query();
      //   return request(server)
      //     .get('/companies/2')
      //     .query(query)
      //     .end((_, res) => {
      //       expect(res.status).toBe(200);
      //       expect(res.body.users).toBeDefined();
      //       expect(res.body.users.length).not.toBe(0);
      //       done();
      //     });
      // });
    });
    //
    // describe('#query nested join', () => {
    //   it('should return status 400, 1', (done) => {
    //     const query = qb
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .setFilter({
    //         field: 'company.projects.foo',
    //         operator: 'excl',
    //         value: 'invalid',
    //       })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(500);
    //         done();
    //       });
    //   });
    //   it('should return status 400, 2', (done) => {
    //     const query = qb
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .setFilter({
    //         field: 'invalid.projects',
    //         operator: 'excl',
    //         value: 'invalid',
    //       })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(500);
    //         done();
    //       });
    //   });
    //   it('should return status 400, 3', (done) => {
    //     const query = qb
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .setFilter({
    //         field: 'company.foo',
    //         operator: 'excl',
    //         value: 'invalid',
    //       })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(500);
    //         done();
    //       });
    //   });
    //   it('should return status 200', (done) => {
    //     const query = qb
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projectsinvalid' })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         done();
    //       });
    //   });
    //   it('should return joined entity, 1', (done) => {
    //     const query = qb
    //       .setFilter({ field: 'company.name', operator: 'excl', value: 'invalid' })
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.company).toBeDefined();
    //         expect(res.body.company.projects).toBeDefined();
    //         done();
    //       });
    //   });
    //   it('should return joined entity, 2', (done) => {
    //     const query = qb
    //       .setFilter({ field: 'company.projects.id', operator: 'notnull' })
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.company).toBeDefined();
    //         expect(res.body.company.projects).toBeDefined();
    //         done();
    //       });
    //   });
    //   it('should return joined entity with alias', (done) => {
    //     const query = qb
    //       .setFilter({ field: 'pr.id', operator: 'notnull' })
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .query();
    //     return request(server)
    //       .get('/users2/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.company).toBeDefined();
    //         expect(res.body.company.projects).toBeDefined();
    //         done();
    //       });
    //   });
    //   it('should return joined entity with ManyToMany pivot table', (done) => {
    //     const query = qb
    //       .setJoin({ field: 'users' })
    //       .setJoin({ field: 'userProjects' })
    //       .query();
    //     return request(server)
    //       .get('/projects/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.users).toBeDefined();
    //         expect(res.body.users.length).toBe(2);
    //         expect(res.body.users[0].id).toBe(1);
    //         expect(res.body.userProjects).toBeDefined();
    //         expect(res.body.userProjects.length).toBe(2);
    //         expect(res.body.userProjects[0].review).toBe('User project 1 1');
    //         done();
    //       });
    //   });
    // });
    //
    // describe('#query composite key join', () => {
    //   it('should return joined relation', (done) => {
    //     const query = qb.setJoin({ field: 'userLicenses' }).query();
    //     return request(server)
    //       .get('/users/1')
    //       .query(query)
    //       .end((_, res) => {
    //         expect(res.status).toBe(200);
    //         expect(res.body.userLicenses).toBeDefined();
    //         done();
    //       });
    //   });
    // });
    //
    // describe('#sort', () => {
    //   it('should sort by field', async () => {
    //     const query = qb.sortBy({ field: 'id', order: 'DESC' }).query();
    //     const res = await request(server)
    //       .get('/users')
    //       .query(query)
    //       .expect(200);
    //     expect(res.body[1].id).toBeLessThan(res.body[0].id);
    //   });
    //
    //   it('should sort by nested field, 1', async () => {
    //     const query = qb
    //       .setFilter({ field: 'company.id', operator: 'notnull' })
    //       .setJoin({ field: 'company' })
    //       .sortBy({ field: 'company.id', order: 'DESC' })
    //       .query();
    //     const res = await request(server)
    //       .get('/users')
    //       .query(query)
    //       .expect(200);
    //     expect(res.body[res.body.length - 1].company.id).toBeLessThan(
    //       res.body[0].company.id,
    //     );
    //   });
    //
    //   it('should sort by nested field, 2', async () => {
    //     const query = qb
    //       .setFilter({ field: 'id', operator: 'eq', value: 1 })
    //       .setFilter({ field: 'company.id', operator: 'notnull' })
    //       .setFilter({ field: 'projects.id', operator: 'notnull' })
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .sortBy({ field: 'projects.id', order: 'DESC' })
    //       .query();
    //     const res = await request(server)
    //       .get('/users')
    //       .query(query)
    //       .expect(200);
    //     expect(res.body[0].company.projects[1].id).toBeLessThan(
    //       res.body[0].company.projects[0].id,
    //     );
    //   });
    //
    //   it('should sort by nested field, 3', async () => {
    //     const query = qb
    //       .setFilter({ field: 'id', operator: 'eq', value: 1 })
    //       .setFilter({ field: 'company.id', operator: 'notnull' })
    //       .setFilter({ field: 'projects.id', operator: 'notnull' })
    //       .setJoin({ field: 'company' })
    //       .setJoin({ field: 'company.projects' })
    //       .sortBy({ field: 'company.projects.id', order: 'DESC' })
    //       .query();
    //     const res = await request(server)
    //       .get('/users')
    //       .query(query)
    //       .expect(200);
    //     expect(res.body[0].company.projects[1].id).toBeLessThan(
    //       res.body[0].company.projects[0].id,
    //     );
    //   });
    // });
    //
    // describe('#search', () => {
    //   const projects2 = () => request(server).get('/projects2');
    //   const projects3 = () => request(server).get('/projects3');
    //   const projects4 = () => request(server).get('/projects4');
    //
    //   it('should return with search, 1', async () => {
    //     const query = qb.search({ id: 1 }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 2', async () => {
    //     const query = qb.search({ id: 1, name: 'Project1' }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 3', async () => {
    //     const query = qb.search({ id: 1, name: { $eq: 'Project1' } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 4', async () => {
    //     const query = qb.search({ name: { $eq: 'Project1' } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 5', async () => {
    //     const query = qb.search({ id: { $notnull: true, $eq: 1 } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 6', async () => {
    //     const query = qb.search({ id: { $or: { $isnull: true, $eq: 1 } } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 7', async () => {
    //     const query = qb.search({ id: { $or: { $eq: 1 } } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 8', async () => {
    //     const query = qb
    //       .search({ id: { $notnull: true, $or: { $eq: 1, $in: [30, 31] } } })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 9', async () => {
    //     const query = qb.search({ id: { $notnull: true, $or: { $eq: 1 } } }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(1);
    //   });
    //   it('should return with search, 10', async () => {
    //     const query = qb.search({ id: null }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(0);
    //   });
    //   it('should return with search, 11', async () => {
    //     const query = qb
    //       .search({ $and: [{ id: { $notin: [5, 6, 7, 8, 9, 10] } }, { isActive: true }] })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(4);
    //   });
    //   it('should return with search, 12', async () => {
    //     const query = qb
    //       .search({ $and: [{ id: { $notin: [5, 6, 7, 8, 9, 10] } }] })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(14);
    //   });
    //   it('should return with search, 13', async () => {
    //     const query = qb.search({ $or: [{ id: 54 }] }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(0);
    //   });
    //   it('should return with search, 14', async () => {
    //     const query = qb
    //       .search({ $or: [{ id: 54 }, { id: 33 }, { id: { $in: [1, 2] } }] })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(2);
    //     expect(res.body[0].id).toBe(1);
    //     expect(res.body[1].id).toBe(2);
    //   });
    //   it('should return with search, 15', async () => {
    //     const query = qb.search({ $or: [{ id: 54 }], name: 'Project1' }).query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(0);
    //   });
    //   it('should return with search, 16', async () => {
    //     const query = qb
    //       .search({ $or: [{ isActive: false }, { id: 3 }], name: 'Project3' })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(3);
    //   });
    //   it('should return with search, 17', async () => {
    //     const query = qb
    //       .search({ $or: [{ isActive: false }, { id: { $eq: 3 } }], name: 'Project3' })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(3);
    //   });
    //   it('should return with search, 17', async () => {
    //     const query = qb
    //       .search({
    //         $or: [{ isActive: false }, { id: { $eq: 3 } }],
    //         name: { $eq: 'Project3' },
    //       })
    //       .query();
    //     const res = await projects2()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(3);
    //   });
    //   it('should return with default filter, 1', async () => {
    //     const query = qb.search({ name: 'Project11' }).query();
    //     const res = await projects3()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(11);
    //   });
    //   it('should return with default filter, 2', async () => {
    //     const query = qb.search({ name: 'Project1' }).query();
    //     const res = await projects3()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(0);
    //   });
    //   it('should return with default filter, 3', async () => {
    //     const query = qb.search({ name: 'Project2' }).query();
    //     const res = await projects4()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(1);
    //     expect(res.body[0].id).toBe(2);
    //   });
    //   it('should return with default filter, 4', async () => {
    //     const query = qb.search({ name: 'Project11' }).query();
    //     const res = await projects4()
    //       .query(query)
    //       .expect(200);
    //     expect(res.body).toBeArrayOfSize(0);
    //   });
    // });
    //
    // describe('#update', () => {
    //   it('should update company id of project', async () => {
    //     await request(server)
    //       .patch('/projects/18')
    //       .send({ companyId: 10 })
    //       .expect(200);
    //
    //     const modified = await request(server)
    //       .get('/projects/18')
    //       .expect(200);
    //
    //     expect(modified.body.companyId).toBe(10);
    //   });
    // });
  });
});

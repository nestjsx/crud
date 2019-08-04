import { Controller, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Crud } from '../src/decorators';
import { CrudController } from '../src/interfaces';
import { CreateTestDTO, UpdateTestDTO } from './__fixture__/dto';
import { TestModel } from './__fixture__/test.model';
import { TestService } from './__fixture__/test.service';

describe('#crud', () => {
  describe('#dto options', () => {
    let app: INestApplication;
    let server: any;

    @Crud({
      model: { type: TestModel },
      dto: {
        create: CreateTestDTO,
        update: UpdateTestDTO,
      },
    })
    @Controller('test')
    class TestController implements CrudController<TestModel> {
      constructor(public service: TestService<TestModel>) {}
    }

    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        controllers: [TestController],
        providers: [TestService],
      }).compile();

      app = fixture.createNestApplication();

      await app.init();
      server = app.getHttpServer();
    });

    describe('#Can use dto.create instead of model.type', () => {
      it('Should return status 400', (done) => {
        return request(server)
          .post('/test')
          .send({
            firstName: 'name',
            lastName: 'name',
            age: 'is a string',
            email: 'no an email',
          })
          .expect(400)
          .end((_, res) => {
            expect(res.body.message[0].constraints.isNumber).toBe('age must be a number');
            expect(res.body.message[1].constraints.isEmail).toBe(
              'email must be an email',
            );
            done();
          });
      });
    });
    describe('#Can use dto.update instead of model.type', () => {
      it('Should return status 400', (done) => {
        return request(server)
          .put('/test/1')
          .send({
            age: 'is a string',
          })
          .expect(400)
          .end((_, res) => {
            expect(res.body.message.length).toBe(1);
            expect(res.body.message[0].constraints.isNumber).toBe('age must be a number');
            done();
          });
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });
});

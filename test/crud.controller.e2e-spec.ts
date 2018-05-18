import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from './mocks/mock-repository';
import { MockEntity } from './mocks/mock-entity';
import { MockService } from './mocks/mock-service';
import { MockController } from './mocks/mock-controller';

describe('CrudController (e2e)', () => {
  const testEntity = { id: 1, name: 'test' };
  const testEntity2 = { id: 1, name: 'test2' };

  let app: INestApplication;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      providers: [
        MockService,
        {
          provide: getRepositoryToken(MockEntity),
          useValue: new MockRepository(),
        },
      ],
      controllers: [MockController],
    }).compile();

    app = fixture.createNestApplication();

    await app.init();
  });

  it('/GET /mock (200)', () => {
    return request(app.getHttpServer())
      .get('/mock')
      .expect(200)
      .expect([]);
  });

  it('/POST /mock (BadRequestException)', () => {
    return request(app.getHttpServer())
      .post('/mock')
      .send({})
      .expect(400);
  });

  it('/POST /mock (201)', () => {
    return request(app.getHttpServer())
      .post('/mock')
      .send({ ...testEntity, id: undefined })
      .expect(201)
      .expect(testEntity);
  });

  it('/GET /mock/:id (404)', () => {
    return request(app.getHttpServer())
      .get('/mock/11')
      .expect(404);
  });

  it('/GET /mock/:id (200)', () => {
    return request(app.getHttpServer())
      .get('/mock/1')
      .expect(200)
      .expect(testEntity);
  });

  it('/GET /mock (200)', () => {
    return request(app.getHttpServer())
      .get('/mock')
      .expect(200)
      .expect([testEntity]);
  });

  it('/PUT /mock/:id (400)', () => {
    return request(app.getHttpServer())
      .put('/mock/false')
      .send({})
      .expect(400);
  });

  it('/PUT /mock/:id (400)', () => {
    return request(app.getHttpServer())
      .put('/mock/1')
      .send()
      .expect(400);
  });

  it('/PUT /mock/:id (404)', () => {
    return request(app.getHttpServer())
      .put('/mock/11')
      .send()
      .expect(404);
  });

  it('/PUT /mock/:id (200)', () => {
    return request(app.getHttpServer())
      .put('/mock/1')
      .send(testEntity2)
      .expect(200)
      .expect(testEntity2);
  });

  it('/DELETE /mock/:id (404)', () => {
    return request(app.getHttpServer())
      .delete('/mock/11')
      .expect(404);
  });

  it('/DELETE /mock/:id (200)', () => {
    return request(app.getHttpServer())
      .delete('/mock/1')
      .expect(200);
  });
});

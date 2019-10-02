import { Controller, INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import * as request from 'supertest';
//
import { Category } from '../../../integration/crud-typeorm/categories';
import { Company } from '../../../integration/crud-typeorm/companies';
import { withCache } from '../../../integration/crud-typeorm/orm.config';
import { Project } from '../../../integration/crud-typeorm/projects';
import { HttpExceptionFilter } from '../../../integration/shared/https-exception.filter';
//
import { CategoriesService } from './__fixture__/categories.service';
import { CompaniesService } from './__fixture__/companies.service';
import { ProjectsService } from './__fixture__/projects.service';

// tslint:disable:max-classes-per-file no-shadowed-variable
describe('#crud-typeorm', () => {
  describe('#nested-relations', () => {
    // variables
    let app: INestApplication;
    let server: any;
    let projects_service: ProjectsService;
    let companies_service: CompaniesService;
    let categories_service: CategoriesService;

    // projects controller
    @Crud({
      model: { type: Project },
      query: {
        join: {
          category: {},
          'category.image': {},
          'category.children': {},
          'category.children.image': {},
          'category.children.children': {},
          'category.children.children.image': {},
        },
      },
    })
    @Controller('projects')
    class ProjectsController {
      constructor(public service: ProjectsService) {}
    }

    // projects controller
    @Crud({
      model: { type: Category },
    })
    @Controller('projects')
    class CategoriesController {
      constructor(public service: CategoriesService) {}
    }

    // hooks
    beforeAll(async () => {
      const fixture = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({ ...withCache, logging: false }),
          TypeOrmModule.forFeature([Project, Category, Company]),
        ],
        controllers: [ProjectsController, CategoriesController],
        providers: [
          { provide: APP_FILTER, useClass: HttpExceptionFilter },
          CompaniesService,
          ProjectsService,
          CategoriesService,
        ],
      }).compile();

      app = fixture.createNestApplication();
      //
      projects_service = app.get<ProjectsService>(ProjectsService);
      categories_service = app.get<CategoriesService>(CategoriesService);
      //
      await app.init();
      server = app.getHttpServer();
    });

    afterAll(async () => {
      app.close();
    });

    describe('#projects service', () => {
      it('has relation with Category ', () => {
        expect(
          projects_service.repo.metadata.columns.find(
            (column_metadata) =>
              column_metadata.propertyName === 'category' &&
              column_metadata.relationMetadata.type === Category,
          ),
        ).toBeTruthy();
      });

      describe('has three level of categories in response', () => {
        let res: any;
        beforeAll(async () => {
          const q = new RequestQueryBuilder()
            .setJoin({
              field: 'category',
            })
            .setJoin({
              field: 'category.image',
            })
            .setJoin({
              field: 'category.children',
            })
            .setJoin({
              field: 'category.children.image',
            })
            .setJoin({
              field: 'category.children.children',
            })
            .setJoin({
              field: 'category.children.children.image',
            })
            .query();
          res = await request(server)
            .get('/projects/1')
            .query(q)
            .expect(200)
            .then((res) => res);
        });
        it('correct project', () => {
          expect(res.body.id).toEqual(1);
        });
        it('project has category', () => {
          expect(res.body.category.id).toEqual(1);
        });
        it('subcategory level 2', () => {
          expect(res.body.category.children.length).toEqual(2);
        });
        it('subcategory level 3', () => {
          expect(res.body.category.children[0].children.length).toEqual(2);
        });
        it('category has image', () => {
          expect(res.body.category.image.id).toEqual(1);
        });
        it('category.children has image', () => {
          expect(res.body.category.children[0].image.id).toEqual(3);
        });
        it('category.children.children has image', () => {
          expect(res.body.category.children[0].children[0].image.id).toEqual(7);
        });
      });

      describe('correct processing with the reverse ordering of defining fields', () => {
        let res: any;
        beforeAll(async () => {
          const q = new RequestQueryBuilder()
            .setJoin({
              field: 'category.image',
            })
            .setJoin({
              field: 'category',
            })
            .setJoin({
              field: 'category.children',
            })
            .query();
          res = await request(server)
            .get('/projects/1')
            .query(q)
            .expect(200)
            .then((res) => res);
        });
        it('project has category', () => {
          expect(res.body.category.id).toEqual(1);
        });
        it('category has children', () => {
          expect(res.body.category.children.length).toEqual(2);
        });
        it('category has image', () => {
          expect(res.body.category.image.id).toEqual(1);
        });
      });
    });
  });
});

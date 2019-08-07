import { Global, Module } from '@nestjs/common';
import * as Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { UserProfile } from './users-profiles';
import { Project } from './projects';
import { Company } from './companies';
import { User } from './users';
import { KNEX_CONNECTION } from './injection-tokens';
import { UserProject } from './users-projects';

const models = [User, Company, Project, UserProfile, UserProject];

const modelProviders = models.map(model => {
  return {
    provide: model.name,
    useValue: model
  };
});

const providers = [
  ...modelProviders,
  {
    provide: KNEX_CONNECTION,
    useFactory: async () => {
      const knex = Knex({
        client: 'pg',
        connection: 'postgres://root:root@127.0.0.1:5455/nestjsx_crud_objection',
        debug: process.env.KNEX_DEBUG === 'true',
        ...knexSnakeCaseMappers()
      });

      Model.knex(knex);
      return knex;
    }
  }
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers]
})
export class DatabaseModule {}

import { Inject, Controller, Type, Logger, DynamicModule, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestfulService } from './classes';
import { Crud, Feature } from './decorators';
import { RepositoryService } from './typeorm';
import { CrudOptions } from '.';

const logger = new Logger('CrudModule');

export interface CreateCRUDOptions<T = any> {
  path: string;
  entity: Type<T>;
  feature?: string;
  crud?: CrudOptions;
  service?: Type<RepositoryService<T>>;
}

function createService(opt: CreateCRUDOptions) {
  const S = opt.service || RepositoryService;

  class GenericRepositoryService extends S {
    constructor(@InjectRepository(opt.entity) repo) {
      super(repo);
      logger.log(`GenericRepositoryService for ${opt.feature} created`);
    }
  }

  return GenericRepositoryService;
}

function createController(opt: CreateCRUDOptions) {
  @Crud(opt.entity, opt.crud)
  @Feature(opt.feature)
  @Controller(opt.path)
  class GenericCRUDController {
    constructor(@Inject(getServiceToken(opt.feature)) public service) {
      logger.log(`GenericCRUDController for ${opt.feature} created`);
    }
  }

  Object.defineProperty(GenericCRUDController, 'name', {
    value: `GenericCRUDControllerFor${opt.feature}`,
    writable: false,
  });

  return GenericCRUDController;
}

function getServiceToken(feature: string) {
  return `REPO-${feature}-Service`;
}

export class CrudModule {
  static forFeature(path: string, service: Function, entity: Function, dto?: any): Type<any> {
    @Crud(entity)
    @Controller(path)
    class CrudGeneratedController {
      constructor(@Inject(service) public service) {}
    }

    return CrudGeneratedController;
  }

  static forFeature2(options: CreateCRUDOptions[]): DynamicModule {
    const providers: Provider[] = [];
    const controllers: Type<any>[] = [];

    for (const opt of options) {
      if (!opt.feature) {
        opt.feature = opt.entity.name;
      }

      providers.push({
        provide: getServiceToken(opt.feature),
        useClass: createService(opt),
      });

      controllers.push(createController(opt));
    }

    return {
      module: CrudModule,
      providers,
      controllers,
    };
  }
}

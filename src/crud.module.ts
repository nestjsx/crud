import { Inject, Controller, Type } from '@nestjs/common';
import { RestfulService } from './classes';
import { Crud } from './decorators';

export class CrudModule {
  static forFeature(path: string, service: Function, entity: Function, dto?: any): Type<any> {
    @Crud(entity)
    @Controller(path)
    class CrudGeneratedController {
      constructor(@Inject(service) public service) {}
    }

    Object.defineProperty(CrudGeneratedController, 'name', {
      value: `CrudGeneratedControllerFor${entity.name}`,
      writable: false,
    });

    return CrudGeneratedController;
  }
}

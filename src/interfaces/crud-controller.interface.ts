import { ObjectLiteral } from './object-literal.interface';
import { RestfulOptions } from './restful-options.interface';
import { RestfulParamsDto } from '../dto/restful-params.dto';
import { RestfulService } from '../classes/restful-service.class';

export interface CrudController<S extends RestfulService<T>, T> {
  service: S;
  paramsFilter?: string[] | ObjectLiteral;
  options?: RestfulOptions;
  getManyBase?(query: RestfulParamsDto, params?: ObjectLiteral): Promise<T[]>;
  getOneBase?(params: any, query: RestfulParamsDto): Promise<T>;
  createOneBase?(dto: T): Promise<T>;
  updateOneBase?(params: any, dto: T): Promise<void>;
  deleteOneBase?(): Promise<void>;
}

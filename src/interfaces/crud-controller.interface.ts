import { FilterParamParsed } from './request-parsed-params.interface';
import { RestfulOptions } from './restful-options.interface';
import { RestfulParamsDto } from '../dto/restful-params.dto';
import { RestfulService } from '../classes/restful-service.class';

export interface CrudController<S extends RestfulService<T>, T> {
  service: S;
  getManyBase?(query: RestfulParamsDto, options: RestfulOptions): Promise<T[]>;
  getOneBase?(query: RestfulParamsDto, options: RestfulOptions): Promise<T>;
  createOneBase?(params: FilterParamParsed[], dto: T): Promise<T>;
  createManyBase?(params: FilterParamParsed[], dto: EntitiesBulk<T>): Promise<T[]>;
  updateOneBase?(params: FilterParamParsed[], dto: T): Promise<T>;
  deleteOneBase?(params: FilterParamParsed[]): Promise<void>;
}

export interface EntitiesBulk<T> {
  bulk: T[];
}

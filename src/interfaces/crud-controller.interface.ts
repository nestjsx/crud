import { ObjectLiteral } from './object-literal.interface';
import { RestfulParamsDto } from '../dto/restful-params.dto';
import { RestfulService } from '../classes/restful-service.class';

export interface CrudController<S extends RestfulService<T>, T> {
  service: S;
  getManyBase?(params: ObjectLiteral, query: RestfulParamsDto): Promise<T[]>;
  getOneBase?(params: ObjectLiteral, query: RestfulParamsDto): Promise<T>;
  createOneBase?(params: ObjectLiteral, dto: T): Promise<T>;
  createManyBase?(params: ObjectLiteral, dto: EntitiesBulk<T>): Promise<T[]>;
  updateOneBase?(id: number | string, params: ObjectLiteral, dto: T): Promise<T>;
  deleteOneBase?(id: number | string, params: ObjectLiteral): Promise<void>;
}

export interface EntitiesBulk<T> {
  bulk: T[];
}

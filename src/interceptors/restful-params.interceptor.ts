import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';

import { CrudOptions, FilterParamParsed, ObjectLiteral, RestfulOptions } from '../interfaces';
import { PARSED_OPTIONS_METADATA, PARSED_PARAMS_REQUEST_KEY } from '../constants';
import { getCrudOptionsMeta } from '../decorators/helpers';

@Injectable()
export class RestfulParamsInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const controller = context.getClass();
    const crudOptions = getCrudOptionsMeta(controller);

    const { parsedParams, options } = await this.transform(req.params, crudOptions);

    req[PARSED_PARAMS_REQUEST_KEY] = parsedParams;
    req[PARSED_OPTIONS_METADATA] = options;

    return next.handle();
  }

  private async transform(
    params: ObjectLiteral,
    crudOptions: CrudOptions,
  ): Promise<{ options: RestfulOptions; parsedParams: FilterParamParsed }> {
    const transformed: any = {};
    const keys = isObject(params) ? Object.keys(params) : [];

    if (keys.length) {
      // parse params
      transformed.parsedParams = keys.map(
        (key) =>
          ({
            field: key,
            operator: 'eq',
            value: this.validate(key, crudOptions.params[key], params[key]),
          } as FilterParamParsed),
      );
    } else {
      transformed.parsedParams = [];
    }

    // parseOptions
    transformed.options = this.parseOptions(transformed.parsedParams, crudOptions);

    return transformed;
  }

  /**
   * Validate params
   * @param key
   * @param type
   * @param value
   */
  private validate(key: string, type: 'number' | 'string' | 'uuid', value: string): any {
    switch (type) {
      // is number
      case 'number':
        const isNumeric =
          'string' === typeof value && !isNaN(parseFloat(value)) && isFinite(value as any);

        if (!isNumeric) {
          throw new BadRequestException(
            `Validation failed. Param '${key}': numeric string is expected`,
          );
        }

        return parseInt(value, 10);

      // is UUID
      case 'uuid':
        const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuid.test(value)) {
          throw new BadRequestException(
            `Validation failed. Param '${key}': UUID string is expected`,
          );
        }

        return value;

      // is string
      default:
        return value;
    }
  }

  /**
   * Parse options
   * @param parsedParams
   */
  private parseOptions(parsedParams: FilterParamParsed[], crudOptions: CrudOptions): CrudOptions {
    const options = Object.assign({}, crudOptions.options || {}) as RestfulOptions;
    const optionsFilter = options.filter || [];
    const filter = [...optionsFilter, ...parsedParams];

    if (filter.length) {
      options.filter = filter;
    }

    return { ...crudOptions, options };
  }
}

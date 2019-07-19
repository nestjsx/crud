import { ValidationPipe } from '@nestjs/common';
import { isFalse } from '@nestjsx/util';

import { CrudValidationGroups } from '../enums';
import { CreateManyDto, CrudOptions } from '../interfaces';
import { safeRequire } from '../util';

const validator = safeRequire('class-validator');
const transformer = safeRequire('class-transformer');
const swagger = safeRequire('@nestjs/swagger');

// tslint:disable-next-line:ban-types
function ApiModelProperty(options?: any): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    /* istanbul ignore else */
    if (swagger) {
      // tslint:disable-next-line
      const { ApiModelProperty } = swagger;
      ApiModelProperty(options)(target, propertyKey);
    }
  };
}

class BulkDto<T> implements CreateManyDto<T> {
  bulk: T[];
}

export class Validation {
  static getValidationPipe(
    options: CrudOptions,
    group: CrudValidationGroups,
  ): ValidationPipe {
    return validator && !isFalse(options.validation)
      ? new ValidationPipe({ ...(options.validation || {}), groups: [group] })
      : /* istanbul ignore next */ undefined;
  }

  static createBulkDto<T = any>(options: CrudOptions): any {
    /* istanbul ignore else */
    if (validator && transformer && !isFalse(options.validation)) {
      const { IsArray, ArrayNotEmpty, ValidateNested } = validator;
      const { Type } = transformer;
      const groups = [CrudValidationGroups.CREATE];

      const Model = options.model.type;

      // tslint:disable-next-line:max-classes-per-file
      class BulkDtoImpl implements CreateManyDto<T> {
        @ApiModelProperty({ type: Model, isArray: true })
        @IsArray({ groups })
        @ArrayNotEmpty({ groups })
        @ValidateNested({ each: true, groups })
        @Type(() => Model)
        bulk: T[];
      }

      Object.defineProperty(BulkDtoImpl, 'name', {
        writable: false,
        value: `Generated${Model.name}BulkDto`,
      });

      return BulkDtoImpl;
    } else {
      return BulkDto;
    }
  }
}

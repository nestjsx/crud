import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RestfulQueryValidationPipe implements PipeTransform {
  async transform(value: any) {
    const options = {
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
    };
    let errors = [];

    try {
      const { RestfulParamsDto } = require('../dto/restful-params.dto');
      const classValidator = require('class-validator');
      const classTransformer = require('class-transformer');
      const dto = classTransformer.plainToClass(RestfulParamsDto, value);
      errors = await classValidator.validate(dto, options);
    } catch (error) {}

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}

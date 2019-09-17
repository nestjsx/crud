import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RequestQueryException } from '@nestjsx/crud-request';
import { Response } from 'express';

@Catch(RequestQueryException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: RequestQueryException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
    });
  }
}

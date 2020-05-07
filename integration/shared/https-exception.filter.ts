import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { status, json } = this.prepareException(exception);

    response.status(status).send(json);
  }

  prepareException(exc: any): { status: number; json: object } {
    if (process.env.NODE_ENV !== 'test') {
      console.log(exc);
    }

    const error =
      exc instanceof HttpException ? exc : new InternalServerErrorException(exc.message);
    const status = error.getStatus();
    const response = error.getResponse();
    const json = typeof response === 'string' ? { error: response } : response;

    return { status, json };
  }
}

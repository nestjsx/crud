import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/core/adapters';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  await app.listen(process.env.PORT || 3333);
}

bootstrap();

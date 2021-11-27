import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CrudConfigService } from '@rewiko/crud';
import { USER_REQUEST_KEY } from './constants';

// Important: load config before (!!!) you import AppModule
// https://github.com/rewiko/crud/wiki/Controllers#global-options
CrudConfigService.load({
  auth: {
    property: USER_REQUEST_KEY,
  },
  routes: {
    // exclude: ['createManyBase'],
  },
});

import { HttpExceptionFilter } from '../shared/https-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('@rewiko/crud-typeorm')
    .setDescription('@rewiko/crud-typeorm')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();

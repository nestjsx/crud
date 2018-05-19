[![Build Status](https://travis-ci.org/zMotivat0r/nest-crud.svg?branch=master)](https://travis-ci.org/zMotivat0r/nest-crud)
[![Coverage Status](https://coveralls.io/repos/github/zMotivat0r/nest-crud/badge.svg?branch=master)](https://coveralls.io/github/zMotivat0r/nest-crud?branch=master)

## Nest CRUD controllers and services

`@nestjsx/crud` has been designed for creating CRUD controllers and services in Nest applications. It can be used with TypeORM repositories for now, but Mongoose and additional functionality will be available soon.

## API Methods and Endpoints

Assume you've created some CRUD controller with the route `@Controller('cats')`. In that case, Nest will create endpoints as follows:

#### `GET /cats`

Res Data: _array of entities; an empty array_
<br>Res Code: _200_

#### `GET /cats/:id`

Req Params: `:id` - _entity id_
<br>Res Data: _entity object_
<br>Res Code: _200; 400; 404_

#### `POST /cats`

Req Body: _entity object_
<br>Res Data: _entity object_
<br>Res Code: _201; 400_

#### `PUT /cats/:id`

Req Params: `:id` - _entity id_
<br>Req Body: _entity object_
<br>Res Data: _entity object_
<br>Res Code: _201; 400; 404_

#### `DELETE /cats/:id`

Req Params: `:id` - _entity id_
<br>Res Data: _empty_
<br>Res Code: _200; 400; 404_

## Using with TypeORM

#### 1. Install

```bash
npm i @nestjsx/crud typeorm @nestjs/typeorm --save
```

#### 2. Create TypeORM Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}
```

#### 3. Create Service

```typescript
import { CrudTypeOrmService } from '@nestjsx/crud/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';

@Injectable()
export class CatsCrudService extends CrudTypeOrmService<Cat> {
  constructor(
    @InjectRepository(Cat) private readonly repository: Repository<Cat>,
  ) {
    super(repository);
  }
}
```

#### 4. Create Controller

```typescript
import { CrudController } from '@nestjsx/crud';
import { Controller } from '@nestjs/common';
import { Cat } from './cat.entity';
import { CatsCrudService } from './cats-crud.service';

@Controller('cats')
export class CatsCrudController extends CrudController<Cat> {
  constructor(private readonly catsCrudService: CatsCrudService) {
    super(catsCrudService);
  }
}
```

#### 5. Connect everything in your Module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { CatsCrudService } from './cats-crud.service';
import { CatsCrudController } from './cats-crud.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatsCrudService],
  controllers: [CatsCrudController],
})
export class CatsModule {}
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Roadmap

* [x] CRUD for TypeORM
* [ ] CRUD for Mongoose
* [ ] Expose as Dynamic Module
* [ ] Swagger integration
* [ ] Working with relations (extending CRUD)

## Thanks

This was inspired by [nestjs-generic-crud](https://github.com/xavism/nestjs-generic-crud)

## License

MIT

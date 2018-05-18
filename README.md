# Nest CRUD for RESTful APIs (@nestjsx/crud)

## Description

CRUD controllers and services for RESTful APIs built with Nest.

## Using with TypeORM

### 1. Install

```bash
npm i @nestjsx/crud typeorm @nestjs/typeorm --save
```

### 2. Create TypeORM Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}
```

### 3. Create Service

```typescript
import { CrudTypeOrmService } from '@nestjsx/crud';
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

### 4. Create Controller

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

### 5. Connect everything in your Module

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
* [ ] Swagger integration
* [ ] Working with relations (extending CRUD)

## Thanks

This was inspired by [nestjs-generic-crud](https://github.com/xavism/nestjs-generic-crud)

## License

MIT

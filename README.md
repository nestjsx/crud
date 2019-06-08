<p align="center">
  <a href="https://github.com/nestjsx" target="blank"><img src="https://github.com/nestjsx/nestjsx/raw/master/img/logo.png" width="160" alt="Nestjsx Logo" /></a>
</p>
<p align="center">
  A set of opinionated <a href="https://github.com/nestjs/nest" target="blank">NestJS</a> extensions and modules
</p>
<p align="center">
  <a href="https://coveralls.io/github/nestjsx/crud?branch=master"><img src="https://coveralls.io/repos/github/nestjsx/crud/badge.svg?branch=master" alt="Build" /></a>
  <a href="https://travis-ci.org/nestjsx/crud"><img src="https://travis-ci.org/nestjsx/crud.svg?branch=master" alt="Coverage" /></a>
  <a href="https://github.com/nestjsx/crud/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjsx/crud.svg" alt="License" /></a>
  <a href="https://github.com/marmelab/awesome-rest#nodejs"><img src="img/awesome-rest.svg" alt="Awesome REST" /></a>
  <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries"><img src="img/awesome-nest.svg" alt="Awesome Nest" /></a>
</p>

# NestJs CRUD for RESTful APIs

`@nestjsx/crud` has been designed for creating CRUD controllers and services for RESTful applications built with NestJs. It can be used with TypeORM repositories for now, but Mongoose functionality perhaps will be available in the future.

## Features and merits

- CRUD endpoints generation, based on a repository service and an entity.
- Ability to generate CRUD endpoints with predefined path filter.
- Composition of controller methods instead of inheritance (no tight coupling and less surprises)
- Overriding controller methods with ease.
- Request validation.
- Query parameters parsing with filters, pagination, sorting, joins, nested joins, etc.
- Super fast DB query building.
- Additional handy decorators.

## Table of Contents

- [Install](#install)
- [Getting Started](#getting-started)
  - [Entity](#entity)
  - [Service](#service)
  - [Controller](#controller)
- [API Endpoints](#api-endpoints)
- [Swagger](#swagger)
- [Query Parameters](#query-parameters)
- [Repository Service](#repository-service)
  - [Restful Options](#restful-options)
- [Crud Controller](#crud-controller)
  - [Restful Options](#options-restful)
  - [Routes Options](#routes-options)
  - [Params Options](#params-options)
  - [Validation Options](#validation-options)
  - [IntelliSense](#intellisense)
  - [Routes Override](#routes-override)
  - [Adding Routes](#adding-routes)
  - [Additional Decorators](#additional-decorators)
- [Example Project](#example-project)
- [Contribution](#contribution)
- [Tests](#tests)
- [License](#license)

---

## Install

```bash
npm i @nestjsx/crud --save
npm i @nestjs/typeorm typeorm class-validator class-transformer --save
```

## Getting Started

### Entity

Assume you have some TypeORM enitity:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hero {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}
```

### Service

Next, let's create a [Repository Service](#repository-service) for it:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forTypeORM } from '@nestjsx/crud';
import RepositoryService = forTypeORM.RepositoryService;

import { Hero } from './hero.entity';

@Injectable()
export class HeroesService extends RepositoryService<Hero> {
  constructor(@InjectRepository(Hero) repo) {
    super(repo);
  }
}
```

Just like that!

### Controller

Next, let create a [Crud Controller](#crud-controller) that expose some RESTful endpoints for us:

```typescript
import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';

import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';

@Crud(Hero)
@Controller('heroes')
export class HeroesController {
  constructor(public service: HeroesService) {}
}
```

And that's it, no more inheritance and tight coupling. Let's see what happens here:

```typescript
@Crud(Hero)
```

We pass our `Hero` entity as a `dto` for [Validation](#validation) purpose and inject `HeroesService`. After that, all you have to do is to hook up everything in your module. And after being done with these simple steps your application will expose these endpoints:

## API Endpoints

### Get Many Entities

> `GET /heroes`  
> `GET /heroes/:heroId/perks`

_Result:_ array of entities | pagination object with data
_Status Codes:_ 200

### Get One Entity

> `GET /heroes/:id`  
> `GET /heroes/:heroId/perks:id`

_Request Params:_ `:id` - some entity field (slug)  
_Result:_ entity object | error object  
_Status Codes:_ 200 | 404

### Create One Entity

> `POST /heroes`  
> `POST /heroes/:heroId/perks`

_Request Body:_ entity object | entity object with nested (relational) objects  
_Result:_ created entity object | error object  
_Status Codes:_ 201 | 400

### Create Many Entities

> `POST /heroes/bulk`  
> `POST /heroes/:heroId/perks/bulk`

_Request Body:_ array of entity objects | array of entity objects with nested (relational) objects

```json
{
  "bulk": [{ "name": "Batman" }, { "name": "Batgirl" }]
}
```

_Result:_ array of created entitie | error object  
_Status codes:_ 201 | 400

### Update One Entity

> `PATCH /heroes/:id`  
> `PATCH /heroes/:heroId/perks/:id`

_Request Params:_ `:id` - some entity field (slug)  
_Request Body:_ entity object (or partial) | entity object with nested (relational) objects (or partial)  
_Result:_: updated partial entity object | error object  
_Status codes:_ 200 | 400 | 404

### Delete One Entity

> `DELETE /heroes/:id`  
> `DELETE /heroes/:heroId/perks/:id`

_Request Params:_ `:id` - some entity field (slug)  
_Result:_: empty | error object  
_Status codes:_ 200 | 404

## Swagger

[Swagger](https://docs.nestjs.com/recipes/swagger) support is present out of the box, including [Query Parameters](#query-parameters) and [Path Filter](#path-filter).

## Query Parameters

`GET` endpoints that are generated by CRUD controller support some useful query parameters (all of them are _optional_):

- [**`fields`**](#fields) - get selected fields in GET result
- [**`filter`**](#filter) (alias: `filter[]`) - filter GET result by `AND` type of condition
- [**`or`**](#or) (alias: `or[]`) - filter GET result by `OR` type of condition
- [**`sort`**](#sort) (alias: `sort[]`) - sort GET result by some `field` in `ASC | DESC` order
- [**`join`**](#join) (alias: `join[]`) - receive joined relational entities in GET result (with all or selected fields)
- [**`limit`**](#limit) (alias `per_page`) - receive `N` amount of entities
- [**`offset`**](#offset) - offset `N` amount of entities
- [**`page`**](#page) - receive a portion of `limit` (`per_page`) entities (alternative to `offset`)
- [**`cache`**](#cache) - reset cache (if was enabled) and receive entities from the DB

### fields

Selects fields that should be returned in the reponse body.

_Syntax:_

> ?fields=**field1**,**field2**,...

_Example:_

> ?fields=**email**,**name**

### filter

Adds fields request condition (multiple conditions) to your request.

_Syntax:_

> ?filter=**field**||**condition**||**value**

> ?join=**relation**&filter=**relation**.**field**||**condition**||**value**

**_Notice:_** Using nested filter shall join relation first.

_Examples:_

> ?filter=**name**||**eq**||**batman**

> ?filter=**isVillain**||**eq**||**false**&filter=**city**||**eq**||**Arkham** (multiple filters are treated as a combination of `AND` type of conditions)

> ?filter=**shots**||**in**||**12**,**26** (some conditions accept multiple values separated by commas)

> ?filter=**power**||**isnull** (some conditions don't accept value)

_Alias:_ `filter[]`

### filter conditions

(**condition** - `operator`):

- **`eq`** (`=`, equal)
- **`ne`** (`!=`, not equal)
- **`gt`** (`>`, greater than)
- **`lt`** (`<`, lower that)
- **`gte`** (`>=`, greater than or equal)
- **`lte`** (`<=`, lower than or equal)
- **`starts`** (`LIKE val%`, starts with)
- **`ends`** (`LIKE %val`, ends with)
- **`cont`** (`LIKE %val%`, contains)
- **`excl`** (`NOT LIKE %val%`, not contains)
- **`in`** (`IN`, in range, **_accepts multiple values_**)
- **`notin`** (`NOT IN`, not in range, **_accepts multiple values_**)
- **`isnull`** (`IS NULL`, is NULL, **_doesn't accept value_**)
- **`notnull`** (`IS NOT NULL`, not NULL, **_doesn't accept value_**)
- **`between`** (`BETWEEN`, between, **_accepts two values_**)

### or

Adds `OR` conditions to the request.

_Syntax:_

> ?or=**field**||**condition**||**value**

It uses the same [filter conditions](#filter-conditions).

_Rules and examples:_

- If there is only **one** `or` present (without `filter`) then it will be interpreted as simple [filter](#filter):

> ?or=**name**||**eq**||**batman**

- If there are **multiple** `or` present (without `filter`) then it will be interpreted as a compination of `OR` conditions, as follows:  
  `WHERE {or} OR {or} OR ...`

> ?or=**name**||**eq**||**batman**&or=**name**||**eq**||**joker**

- If there are **one** `or` and **one** `filter` then it will be interpreted as `OR` condition, as follows:  
  `WHERE {filter} OR {or}`

> ?filter=**name**||**eq**||**batman**&or=**name**||**eq**||**joker**

- If present **both** `or` and `filter` in any amount (**one** or **miltiple** each) then both interpreted as a combitation of `AND` conditions and compared with each other by `OR` condition, as follows:  
  `WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)`

> ?filter=**type**||**eq**||**hero**&filter=**status**||**eq**||**alive**&or=**type**||**eq**||**villain**&or=**status**||**eq**||**dead**

_Alias:_ `or[]`

### sort

Adds sort by field (by multiple fields) and order to query result.

_Syntax:_

> ?sort=**field**,**ASC|DESC**

_Examples:_

> ?sort=**name**,**ASC**

> ?sort=**name**,**ASC**&sort=**id**,**DESC**

_Alias:_ `sort[]`

### join

Receive joined relational objects in GET result (with all or selected fields). You can join as many relations as allowed in your [Restful Options](#restful-options).

_Syntax:_

> ?join=**relation**

> ?join=**relation**||**field1**,**field2**,...

> ?join=**relation1**||**field11**,**field12**,...&join=**relation1**.**nested**||**field21**,**field22**,...&join=...

_Examples:_

> ?join=**profile**

> ?join=**profile**||**firstName**,**email**

> ?join=**profile**||**firstName**,**email**&join=**notifications**||**content**&join=**tasks**

> ?join=**relation1**&join=**relation1**.**nested**&join=**relation1**.**nested**.**deepnested**

**_Notice:_** `id` field always persists in relational objects. To use nested relations, the parent level **MUST** be set before the child level like example above.

_Alias:_ `join[]`

### limit

Receive `N` amount of entities.

_Syntax:_

> ?limit=**number**

_Example:_

> ?limit=**10**

_Alias:_ `per_page`

### offset

Offset `N` amount of entities

_Syntax:_

> ?offset=**number**

_Example:_

> ?offset=**10**

### page

Receive a portion of `limit` (`per_page`) entities (alternative to `offset`). Will be applied if `limit` is set up.

_Syntax:_

> ?page=**number**

_Example:_

> ?page=**2**

### cache

Reset cache (if was enabled) and receive entities from the DB.

_Usage:_

> ?cache=0

## Repository Service

`RepositoryService` is the main class where all DB operations related logic is in place.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryService } from '@nestjsx/crud/typeorm';
import { RestfulOptions } from '@nestjsx/crud';

import { Hero } from './hero.entity';

@Injectable()
export class HeroesService extends RepositoryService<Hero> {
  protected options: RestfulOptions = {};

  constructor(@InjectRepository(Hero) repo) {
    super(repo);
  }
}
```

This class can accept optional parameter called `options` that will be used as default options for `GET` requests. All fields inside that parameter are otional as well.

### Restful Options

- [**`allow`**](#allow-option)
- [**`exclude`**](#exclude-option)
- [**`persist`**](#persist-option)
- [**`filter`**](#filter-option)
- [**`join`**](#join-option)
- [**`sort`**](#sort-option)
- [**`limit`**](#limit-option)
- [**`maxLimit`**](#maxlimit-option)
- [**`cache`**](#cache-option)

### allow option

An Array of [fields](#fields) that are allowed to receive in `GET` request. If empty or _undefined_ - allow all.

```typescript
{
  allow: ['name', 'email'];
}
```

### exclude option

an Array of [fields](#fields) that will be excluded from the `GET` response (and not queried from the DB).

```typescript
{
  exclude: ['accessToken'];
}
```

### persist option

An Array of [fields](#fields) that will be always persisted in `GET` response

```typescript
{
  persist: ['createdAt'];
}
```

**_Notice:_** `id` field always persists automatically.

### filter option

An Array of `filter` objects that will be merged (combined) with query [filter](#filter) if those are passed in `GET` request. If not - `filter` will be added to the DB query as a stand-alone condition.

If multiple items are added, they will be interpreted as `AND` type of conditions.

```typescript
{
  filter: [
    {
      field: 'deleted',
      operator: 'ne',
      value: true,
    },
  ];
}
```

`operator` property is the same as [filter conditions](#filter-conditions).

### join option

An Object of [relations](http://typeorm.io/#/relations) that allowed to be fetched by passing [join](#join) query parameter in `GET` requests.

```typescript
{
  join: {
    profile: {
      persist: ['name']
    },
    tasks: {
      allow: ['content'],
    },
    notifications: {
      exclude: ['token']
    },
    company: {},
    'company.projects': {
      persist: ['status']
    },
    'users.projects.tasks': {
      exclude: ['description'],
    },
  }
}
```

Each key of `join` object must **strongly match** the name of the corresponding entity relation. If particular relation name **is not** present in this option, then user **will not be able** to [join](#join) it in `GET` request.

Each relation option can have [allow](#allow-option), [exclude](#exclude-option) and [persist](#persist-option). All of them are optional as well.

### sort option

An Array of `sort` objects that will be merged (combined) with query [sort](#sort) if those are passed in `GET` request. If not - `sort` will be added to the DB query as a stand-alone condition.

```typescript
{
  sort: [
    {
      field: 'id',
      order: 'DESC',
    },
  ];
}
```

### limit option

Default [limit](#limit) that will be aplied to the DB query.

```typescript
{
  limit: 25,
}
```

### maxLimit option

Max amount of results that can be queried in `GET` request.

```typescript
{
  maxLimit: 100,
}
```

**_Notice:_** **_it's strongly recommended to set up this option. Otherwise DB query will be executed without any LIMIT if no [limit](#limit) was passed in the query or if the [limit option](#limit-option) hasn't been set up_**.

### cache option

If [Caching Results](http://typeorm.io/#/caching) is implemented on you project, then you can set up default `cache` in milliseconds for `GET` response data.

```typescript
{
  cache: 2000,
}
```

`Cache.id` strategy is based on a query that is built by a service, so if you change one of the query parameters in the next request, the result will be returned by DB and saved in the cache.

Cache can be [reseted](#cache) by using the query parameter in your `GET` requests.

## Crud Controller

Our newly generated working horse.

```typescript
...
import { Crud } from '@nestjsx/crud';

@Crud(Hero, {
  // CrudOptions goes here
})
@Controller('heroes')
export class HeroesCrudController {
  constructor(public service: HeroesService) {}
}
```

`@Crud()` decorator accepts two arguments - Entity class and `CrudOptions` object. All fields here are optional as well. Let's dive in some details.

### Crud Options

- [**`options`**](#options-restful)
- [**`routes`**](#routes-options)
- [**`params`**](#params-options)
- [**`validation`**](#validaton-options)

### Options (restful)

This option has the same structure as as [Restful Options](#restful-options).

**_Notice:_** If you have this options set up in your `RepositoryService`, in that case they will be **merged**.

### Routes Options

This object may have `exclude` and `only` arrays of route names which must be excluded or only which ones must be created accordingly.

```typescript
{
  routes: {
    only: ['getManyBase'];
  }
}
```

```typescript
{
  routes: {
    exclude: ['createManyBase'];
  }
}
```

**_Notice:_** If both are present, then `exclude` will be ignored.

Also, routes options object may have some options for each particular route:

```typescript
{
  routes: {
    getManyBase: {
      interceptors: [],
      decorators: [],
    },
    getOneBase: {
      interceptors: [],
      decorators: [],
    },
    createOneBase: {
      interceptors: [],
      decorators: [],
    },
    createManyBase: {
      interceptors: [],
      decorators: [],
    },
    updateOneBase: {
      interceptors: [],
      decorators: [],
      allowParamsOverride: true
    },
    deleteOneBase: {
      interceptors: [],
      decorators: [],
      returnDeleted: true
    },
  }
}
```

`interceptors` - an array of your custom interceptors  
`decorators` - an array of your custom decorators
`allowParamsOverride` - whether or not to allow body data be overriten by the URL params on PATH request. Default: `false`  
`returnDeleted` - whether or not an entity object should be returned in the response body on DELETE request. Default: `false`

**_Notice:_** `decorators` will not move from original ones to override ones

### Params Options

`CrudOptions` object may have `params` parameter that will be used for validation sake of you URL params and for defining a slug param (if it differs from `id` that is used by default).

Assume, you have an entity `User` that belongs to some `Company` and has a field `companyId`. And you whant to create `UsersController` so that an admin could access users from his own Company only. Let's do this:

```typescript
...
import { Crud } from '@nestjsx/crud';

@Crud(Hero, {
  params: {
    companyId: 'number'
  }
})
@Controller('/company/:companyId/users')
export class UsersCrud {
  constructor(public service: UsersService) {}
}
```

In this example you're URL param name `companyId` should match the name of `User.companyId` field.

If you don't want to use numeric `id` (by default) and, say, you use some unique field, e.g. it's called `slug` and it's a UUID string - in that case need to add this:

```typescript
{
  params: {
    slug: 'uuid';
  }
}
```

Or if your slug/id is just another random unique string, then:

```typescript
{
  params: {
    id: 'string';
  }
}
```

As you might guess, all request will add `companyId` to the DB queries alongside with the `:id` (or another field that you defined) of `GET`, `PATCH`, `DELETE` requests. On `POST` (both: one and bulk) requests, `companyId` will be added to the `dto` automatically.

When you done with the controller, you'll need to add some logic to your `AuthGuard` or any other interface, where you do the authorization of a requester. You will need to match `companyId` URL param with the `user.companyId` entity that has been validated from the DB.

### Validation Options

Request data validation is performed by using [class-validator](https://github.com/typestack/class-validator) package and [ValidationPipe](https://docs.nestjs.com/techniques/validation). If you don't use this approach in your project, then you can implementat request data validation on your own.

We distinguish request validation on `create` and `update` methods. This was achieved by using [validation groups](https://github.com/typestack/class-validator#validation-groups).

Let's take a look at this example:

```typescript
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CrudValidate } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/user-profile.entity';

const { CREATE, UPDATE } = CrudValidate;

@Entity('users')
export class User extends BaseEntity {
  @IsOptional({ groups: [UPDATE] }) // validate on PATCH only
  @IsNotEmpty({ groups: [CREATE] }) // validate on POST only
  @IsString({ always: true }) // validate on both
  @MaxLength(255, { always: true })
  @IsEmail({ require_tld: false }, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profileId: number;

  // validate relations
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ValidateNested({ always: true })
  @Type((t) => UserProfile)
  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;
}
```

You can import `CrudValidate` enum and set up validation rules for each field on firing of `POST`, `PATCH` requests or both of them.

You can pass you custom validation options here:

```typescript
import { Crud } from '@nestjsx/crud';

@Crud(Hero, {
  validation: {
    validationError: {
      target: false,
      value: false
    }
  }
})
@Controller('heroes')
...
```

### IntelliSense

Please, keep in mind that we compose `HeroesController.prototype` by the logic inside our `@Crud()` class decorator. And there are some unpleasant but not very significant side effects of this approach.

First, there is no IntelliSense on composed methods. That's why we need to use `CrudController` interface:

```typescript
...
import { Crud, CrudController } from '@nestjsx/crud';

@Crud(Hero)
@Controller('heroes')
export class HeroesCrud {
  constructor(public service: HeroesService) {}
}
```

This will help to make sure that you're injecting proper [Repository Service](#repository-service).

Second, even after adding `CrudController` interface you still wouldn't see composed methods, accessible from `this` keyword, furthermore, you'll get a TS error. In order to solve this, I've couldn't came up with better idea than this:

```typescript
...
import { Crud, CrudController } from '@nestjsx/crud';

@Crud(Hero)
@Controller('heroes')
export class HeroesCrud {
  constructor(public service: HeroesService) {}

  get base(): CrudController<HeroesService, Hero> {
    return this;
  }
}
```

### Routes Override

List of composed base routes methods:

```typescript
getManyBase(
  @ParsedQuery() query: RestfulParamsDto,
  @ParsedOptions() options: CrudOptions,
): Promise<GetManyDefaultResponse<T> | T[]>;

getOneBase(
  @ParsedQuery() query: RestfulParamsDto,
  @ParsedOptions() options: CrudOptions,
): Promise<T>;

createOneBase(
  @ParsedParams() params: FilterParamParsed[],
  @ParsedBody() dto: T,
): Promise<T>;

createManyBase(
  @ParsedParams() params: FilterParamParsed[],
  @ParsedBody() dto: EntitiesBulk<T>,
): Promise<T[]>;

updateOneBase(
  @ParsedParams() params: FilterParamParsed[]
  @ParsedBody() dto: T,
): Promise<T>;

deleteOneBase(
  @ParsedParams() params: FilterParamParsed[]
): Promise<void | T>;
```

Since all composed methods have `Base` ending in their names, overriding those endpoints could be done in two ways:

1. Attach `@Override()` decorator without any argument to the newly created method wich name doesn't contain `Base` ending. So if you want to override `getManyBase`, you need to create `getMany` method.

2. Attach `@Override('getManyBase')` decorator with passed base method name as an argument if you want to override base method with a function that has a custom name.

```typescript
...
import {
  Crud,
  CrudController,
  Override,
  RestfulParamsDto,
  ParsedQuery,
  ParsedParams,
  ParsedOptions
} from '@nestjsx/crud';

@Crud(Hero, {})
@Controller('heroes')
export class HeroesCrud {
  constructor(public service: HeroesService) {}

  get base(): CrudController<HeroesService, Hero> {
    return this;
  }

  @Override()
  getMany(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedOptions() options: CrudOptions,
  ) {
    // do some stuff
    return this.base.getManyBase(query, options);
  }

  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedQuery() query: RestfulParamsDto,
    @ParsedOptions() options: CrudOptions,
  ) {
    // do some stuff
  }

  @Override()
  createOne(
    @ParsedParams() params,
    @ParsedBody() body: Hero,
  ) {
    return this.base.createOneBase(params, body);
  }

  @Override()
  createMany(
    @ParsedBody() body: EntitiesBulk<Hero>, // validation is working ^_^
    @ParsedParams() params,
    ) {
    return this.base.createManyBase(params, body);
  }

  @Override('updateOneBase')
  coolFunction() {
    @ParsedParams() params,
    @ParsedBody() body: Hero,
  } {
    return this.base.updateOneBase(params, body);
  }

  @Override()
  async deleteOne(
    @ParsedParams() params,
  ) {
    return this.base.deleteOneBase(params);
  }

}
```

**_Notice:_** new custom route decorators were created to simplify process: `@ParsedQuery()`, `@ParsedParams`, `@ParsedBody()`, and `@ParsedOptions()`. But you still can add your param decorators to any of the methods, e.g. `@Param()`, `@Session()`, etc. Or any of your own cutom route decorators.

### Adding Routes

Sometimes you might need to add a new route and to use `@ParsedQuery()`, `@ParsedParams`, `@ParsedOptions()` in it. You need to use `@UsePathInterceptors()` method decorator in order to do that:

```typescript
...
import { UsePathInterceptors } from '@nestjsx/crud';
...

@UsePathInterceptors()
@Get('/export/list.xlsx')
async exportSome(
  @ParsedQuery() query: RestfulParamsDto,
  @ParsedOptions() options: CrudOptions,
) {
  // some logic
}
```

By default this decorator will parse `query` and `param`. But you can specify what you need to parse by passing the appropriate argument (`@UsePathInterceptors('query')` or `@UsePathInterceptors('param')`).

### Additional Decorators

There are two additional decorators that come out of the box: `@Feature()` and `@Action()`:

```typescript
...
import { Feature, Crud, CrudController } from '@nestjsx/crud';

@Feature('Heroes')
@Crud(Hero)
@Controller('heroes')
export class HeroesController {
  constructor(public service: HeroesService) {}
}
```

You can use them with your [ACL](https://en.wikipedia.org/wiki/Access_control_list) implementation. `@Action()` will be applyed automaticaly on controller compoesd base methods. There is `CrudActions` enum that you can import and use:

```typescript
enum CrudActions {
  ReadAll = 'Read-All',
  ReadOne = 'Read-One',
  CreateOne = 'Create-One',
  CreateMany = 'Create-Many',
  UpdateOne = 'Update-One',
  DeleteOne = 'Delete-One',
}
```

`ACLGuard` dummy example:

```typescript
import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getFeature, getAction } from '@nestjsx/crud';

@Injectable()
export class ACLGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const controller = ctx.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);

    console.log(`${feature}-${action}`); // e.g. 'Heroes-Read-All'

    return true;
  }
}
```

## Example Project

[Here](https://github.com/nestjsx/crud/tree/master/restful/integration/typeorm) you can find an example project that uses `@nestjsx/crud` features. In order to run it and play with it, please do the following:

1. If you're using [Visual Studio Code](https://code.visualstudio.com/) it's recommended to add this option to your [User Settings](https://code.visualstudio.com/docs/getstarted/settings):

```json
"javascript.implicitProjectConfig.experimentalDecorators": true
```

Or you can open `integration/typeorm` folder separately in the Visual Studio Code.

2. Clone the project

```shell
git clone https://github.com/nestjsx/crud.git
cd crud/integration/typeorm
```

3. Install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) if you haven't done it yet.

4. Run Docker services:

```shell
docker-compose up -d
```

5. Run application:

```shell
npm run serve
```

Server should start on default port `3333`, you can override in `PORT` environment variable.

If you want to flush the DB data, run:

```shell
npm run db:flush
```

## Contribution

Any support is wellcome. Please open an [issue](https://github.com/nestjsx/crud/issues) or submit a [PR](https://github.com/nestjsx/crud/pulls) if you want to improve the functionality or help with testing edge cases.

## Tests

```shell
docker-compose up -d
npm run test:e2e
```

## License

[MIT](https://github.com/nestjsx/nestjsx/blob/master/LICENSE)

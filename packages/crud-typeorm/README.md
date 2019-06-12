<div align="center">
  <h1>CRUD (@nestjsx/crud-typeorm)</h1>
</div>
<div align="center">
  <strong>for RESTful APIs built with NestJs</strong>
</div>

<br />

<div align="center">
  <a href="https://travis-ci.org/nestjsx/crud">
    <img src="https://travis-ci.org/nestjsx/crud.svg?branch=master" alt="Build" />
  </a>
  <a href="https://coveralls.io/github/nestjsx/crud?branch=master">
    <img src="https://coveralls.io/repos/github/nestjsx/crud/badge.svg" alt="Coverage" />
  </a>
  <a href="https://github.com/nestjsx/crud/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nestjsx/crud.svg" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/@nestjsx/crud">
    <img src="https://img.shields.io/npm/v/@nestjsx/crud.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/org/nestjsx">
    <img src="https://img.shields.io/npm/dm/@nestjsx/crud.svg" alt="npm downloads" />
  </a>
  <a href="https://npm.packagequality.com/#?package=@nestjsx%2Fcrud">
    <img src="https://npm.packagequality.com/shield/%40nestjsx%2Fcrud.svg" alt="Package Quality" />
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/nestjsx/crud.svg" alt="Greenkeeper" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome" />
  </a>
  <a href="https://github.com/marmelab/awesome-rest#nodejs">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/awesome-rest.svg?sanitize=true" alt="Awesome REST" />
  </a>
  <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/awesome-nest.svg?sanitize=true" alt="Awesome Nest" />
  </a>
  <a href="https://github.com/nestjs/nest">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/nest-powered.svg?sanitize=true" alt="Nest Powered" />
  </a>
</div>

<div align="center">
  <sub>Built by
  <a href="https://twitter.com/MichaelYali">@MichaelYali</a> and
  <a href="https://github.com/nestjsx/crud/graphs/contributors">
    Contributors
  </a>
</div>

<br />

We believe that everyone who's working with NestJs and building some RESTful services and especially some CRUD functionality will find `@nestjsx/crud` microframework very useful.

## Features

<img align="right" src="https://raw.githubusercontent.com/nestjsx/crud/master/img/crud-usage2.png" alt="CRUD usage" />

- Super easy to install and start using the full-featured controllers and services :point_right:

- DB and service agnostic extendable CRUD controllers

- Reach query parsing with filtering, pagination, sorting, relations, nested relations, cache, etc.

- Framework agnostic package with query builder for a frontend usage

- Query, path params and DTOs validation included

- Overriding controller methods with ease

- Tiny config (including globally)

- Additional helper decorators

- Swagger documentation

## Install

```shell
npm i @nestjsx/crud-typeorm @nestjs/typeorm typeorm
```

## Packages

- [**@nestjsx/crud**](https://www.npmjs.com/package/@nestjsx/crud) - core package which provides `@Crud()` decorator for endpoints generation, global configuration, validation, helper decorators ([docs](https://github.com/nestjsx/crud/wiki/Controllers#description))
- [**@nestjsx/crud-typeorm**](https://www.npmjs.com/package/@nestjsx/crud-typeorm) - TypeORM package which provides base `TypeOrmCrudService` with methods for CRUD database operations ([docs](https://github.com/nestjsx/crud/wiki/ServiceTypeorm))
- [**@nestjsx/crud-request**](https://www.npmjs.com/package/@nestjsx/crud-request) - request builder/parser package wich provides `RequestQueryBuilder` class for a frontend usage and `RequestQueryParser` that is being used internaly for handling and validating query/path params on a backend side ([docs](https://github.com/nestjsx/crud/wiki/Requests#frontend-usage))

## Documentation

[Wiki](https://github.com/nestjsx/crud/wiki)

## Support

Any support is wellcome.  
You can give us a star, contribute or [donate](https://opencollective.com/nestjsx).

### Contribution

Please open an [issue](https://github.com/nestjsx/crud/issues) or submit a [PR](https://github.com/nestjsx/crud/pulls) if you want to improve the functionality or help with testing edge cases.

### Backers

<a href="https://opencollective.com/nestjsx" target="_blank"><img src="https://opencollective.com/nestjsx/backers.svg?width=1600"></a>

## License

[MIT](LICENSE)

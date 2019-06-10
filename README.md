<div align="center">
  <h1>CRUD</h1>
</div>
<div align="center">
  <strong>for RESTful APIs built with NestJs</strong>
</div>

<br />

<div align="center">
  <a href="https://travis-ci.org/nestjsx/crud"><img src="https://travis-ci.org/nestjsx/crud.svg?branch=master" alt="Build" /></a>
  <a href="https://coveralls.io/github/nestjsx/crud?branch=master"><img src="https://coveralls.io/repos/github/nestjsx/crud/badge.svg" alt="Coverage" /></a>
  <a href="https://github.com/nestjsx/crud/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nestjsx/crud.svg" alt="License" /></a>
  <a href=""><img src="https://img.shields.io/npm/v/@nestjsx/crud.svg" alt="npm" /></a>
  <a href="https://www.npmjs.com/org/nestjsx">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/@nestjsx/crud.svg">
  </a>
  <a href="https://npm.packagequality.com/#?package=@nestjsx%2Fcrud"><img src="https://npm.packagequality.com/shield/%40nestjsx%2Fcrud.svg" alt="Package Quality"/></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/nestjsx/crud.svg" alt="Greenkeeper" /></a>
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome" /></a>
  <a href="https://github.com/marmelab/awesome-rest#nodejs"><img src="img/awesome-rest.svg" alt="Awesome REST" /></a>
  <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries"><img src="img/awesome-nest.svg" alt="Awesome Nest" /></a>
  <a href="https://github.com/nestjs/nest"><img src="img/nest-powered.svg" alt="Nest Powered" /></a>
</div>

<div align="center">
  <sub>Built with :purple_heart: by
  <a href="https://twitter.com/MichaelYali">@MichaelYali</a> and
  <a href="https://github.com/nestjsx/crud/graphs/contributors">
    Contributors
  </a>
  <div align="center">
    :star2: :eyes: :zap: :boom:
  </div>
</div>

<br />

We believe that everyone who's working with NestJs and building some RESTful services and especially some CRUD functionality will find `@nestjsx/crud` microframework very useful.

## Features

<img align="right" src="img/crud-usage2.png" alt="CRUD usage" />

- :electric_plug: Super easy to install and start using the full-featured controllers and services :point_right:

- :octopus: DB and service agnostic extendable CRUD controllers

- :mag_right: Reach query parsing with filtering, pagination, sorting, relations, nested relations, cache, etc.

- :telescope: Framework agnostic package with query builder for a frontend usage

- :space_invader: Query, path params and DTOs validation included

- :clapper: Overriding controller methods with ease

- :wrench: Tiny config (including globally)

- :gift: Additional helper decorators

- :pencil2: Swagger documentation

## Packages

- [**@nestjsx/crud**]() - core package which provides `@Crud()` decorator for endpoints generation, global configuration, validation, helper decorators ([docs]())
- [**@nestjsx/crud-typeorm**]() - TypeORM package which provides base `TypeOrmCrudService` with methods for CRUD database operations ([docs]())
- [**@nestjsx/crud-request**]() - request builder/parser package wich provides `RequestQueryBuilder` class for a frontend usage and `RequestQueryParser` that is being used internaly for handling and validating query/path params on a backend side ([docs]())

## Documentation

Use [Wiki]()

## Roadmap

- [x] Monorepository
- [x] TypeORM
- [ ] Mongoose
- [ ] Sequelize
- [ ] JSON API standard

## Support

Any support is wellcome.

### Contribution

Please open an [issue](https://github.com/nestjsx/crud/issues) or submit a [PR](https://github.com/nestjsx/crud/pulls) if you want to improve the functionality or help with testing edge cases.

### Sponsorship

<a href="https://opencollective.com/nestjsx/donate" target="_blank">
  <img src="https://opencollective.com/nestjsx/donate/button@2x.png?color=blue" width=200 />
</a>

## Tests

```shell
docker-compose up -d
yarn bootstrap
yarn test
```

## License

[MIT](LICENSE)

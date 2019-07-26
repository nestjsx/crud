## [4.2.0] - 2019-07-26

### Features

- **crud** added support for older versions of `UUID` ([#186])

### Bug Fixes

- **crud** fixed `BulkDto` swagger description ([#159])
- **crud** fixed `CrudRequestInterceptor` request parsing
- **requests** added `@nestjsx/util` as a dependency ([#184])
- **requests** fixed condition operators mapping ([#148])
- **requests** fixed ISO date string validation ([#161])
- **typeorm** fixed filtering and sorting by nested fields ([#105])
- **typeorm** fixed `too many nested levels` exception ([#87])
- **typeorm** fixed pagination `pageCount` ([#179])

### Deps

- **dev** updated deps

## [4.1.0] - 2019-06-27

### Features

- **crud** added `PUT` request handling ([#107])
- **requests** added creating request builder with params ([#131])
- **requests** improved query params naming parsing ([#101])

### Bug Fixes

- **crud** set decorators after Swagger so metadata can be overwritten
- **requests** added support for ISO-8610 date strings

## [4.0.1] - 2019-06-21

### Bug Fixes

- **requests** fixed query parser to properly accept numbers and booleans ([#97])

## [4.0.0] - 2019-06-12

### BREAKING CHANGES

- **crud:** changed `CrudOptions` ([docs](https://github.com/nestjsx/crud/wiki/Controllers#options))
- **crud:** remove decorators: `@ParsedOptions`, `@ParsedParams`, `@ParsedQuery`. Add decorator `@ParsedRequest` instead.
- **crud:** change interfaces
- **services:** remove `RestfulOptions` from services
- **services:** changed base abstract class

### Features

- **repo:** refactor to monorepository
- **docs:** new [documentation](https://github.com/nestjsx/crud/wiki)
- **packages:** totally refactor `@nestjsx/crud` to be service (ORM) agnostic
- **packages:** add `@nestjsx/crud-typeorm` ([docs](https://github.com/nestjsx/crud/wiki/ServiceTypeorm))
- **packages:** add `@nestjsx/crud-request` ([docs](https://github.com/nestjsx/crud/wiki/Requests#description), [#53])
- **crud:** add global options ([docs](https://github.com/nestjsx/crud/wiki/Controllers#global-options), [#64])
- **crud:** add eager relations option ([#54], [#67])

### Bug Fixes

- several fixes

[4.2.0]: https://github.com/nestjsx/crud/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/nestjsx/crud/compare/v4.0.1...v4.1.0
[4.0.1]: https://github.com/nestjsx/crud/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/nestjsx/crud/compare/v.3.2.0...v4.0.0
[#97]: https://github.com/nestjsx/crud/issues/97
[#53]: https://github.com/nestjsx/crud/issues/53
[#64]: https://github.com/nestjsx/crud/issues/64
[#54]: https://github.com/nestjsx/crud/issues/54
[#67]: https://github.com/nestjsx/crud/issues/67
[#107]: https://github.com/nestjsx/crud/issues/107
[#131]: https://github.com/nestjsx/crud/issues/131
[#101]: https://github.com/nestjsx/crud/issues/101
[#186]: https://github.com/nestjsx/crud/pull/186
[#184]: https://github.com/nestjsx/crud/issues/184
[#148]: https://github.com/nestjsx/crud/issues/148
[#105]: https://github.com/nestjsx/crud/issues/105
[#87]: https://github.com/nestjsx/crud/issues/87
[#159]: https://github.com/nestjsx/crud/issues/159
[#161]: https://github.com/nestjsx/crud/issues/161
[#179]: https://github.com/nestjsx/crud/issues/179

## [4.0.1] - 2019-06-21

### Bug Fixes

- **requests** fixed query parser to properly accept numbers and booleans (#97)

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
- **packages:** add `@nestjsx/crud-request` ([docs](https://github.com/nestjsx/crud/wiki/Requests#description), #53)
- **crud:** add global options ([docs](https://github.com/nestjsx/crud/wiki/Controllers#global-options), #64)
- **crud:** add eager relations option (#54, #67)

### Bug Fixes

- several fixes

[4.0.1]: https://github.com/nestjsx/crud/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/nestjsx/crud/compare/v.3.2.0...v4.0.0

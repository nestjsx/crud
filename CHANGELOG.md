# 4.0.0 (2019-06-12)

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
- **packages:** add `@nestjsx/crud-request` ([docs](https://github.com/nestjsx/crud/wiki/Requests#description), [#53](https://github.com/nestjsx/crud/issues/53))
- **crud:** add global options ([docs](https://github.com/nestjsx/crud/wiki/Controllers#global-options), [#64](https://github.com/nestjsx/crud/issues/64))
- **crud:** add eager relations option ([#54](https://github.com/nestjsx/crud/issues/54), [#67](https://github.com/nestjsx/crud/issues/67))

### Bug Fixes

- several fixes

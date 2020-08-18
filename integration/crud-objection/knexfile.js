require('ts-node/register');
const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  client: 'pg',
  connection: 'postgres://root:root@127.0.0.1:5455/nestjsx_crud_objection',
  migrations: {
    directory: './migrations',
    stub: './migration.stub',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
    stub: './seed.stub',
    extension: 'ts',
  },
  ...knexSnakeCaseMappers(),
};

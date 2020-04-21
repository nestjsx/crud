import Umzug = require('umzug');
import { Sequelize } from 'sequelize';
export class Helper {
  umzug: Umzug.Umzug;
  constructor(private readonly sequelize: Sequelize) {
    this.umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: { sequelize: this.sequelize, tableName: 'SequelizeMeta' },
      migrations: {
        params: [
          this.sequelize.getQueryInterface(),
          this.sequelize.constructor, // DataTypes
          // eslint-disable-next-line func-names
          function() {
            throw new Error(
              'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.',
            );
          },
        ],
        path:
          process.env.MIGRATIONS_PATH ||
          `${__dirname}/../../../integration/crud-sequelize/migrations`,
        pattern: /\.js$/,
      },
      logging: !!process.env.SQL_LOG ? console.log : false,
    });
    /*this.umzug.on('migrating', (name) => console.log('migrating', name));
    this.umzug.on('migrated', (name) => console.log('migrated', name));
    this.umzug.on('reverting', (name) => console.log('migrated', name));
    this.umzug.on('reverted', (name) => console.log('reverted', name));*/
  }

  async up(): Promise<Umzug.Migration[]> {
    const migrations = await this.umzug.up();
    return migrations;
  }

  async down(): Promise<Umzug.Migration[]> {
    const migrations = await this.umzug.down({ to: 0 });
    return migrations;
  }
}

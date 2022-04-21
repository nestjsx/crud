/* eslint-disable @typescript-eslint/no-var-requires */

const tsconfig = require('tsconfig-extends');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const compilerOptions = tsconfig.load_file_sync('./tsconfig.jest.json', __dirname);

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/packages/',
  }),
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '\\.spec.ts$',
  rootDir: '.',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  coverageReporters: ['json', 'lcov', 'text-summary'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/**/*.d.ts',
    '!packages/**/index.ts',
    '!packages/**/*.interface.ts',
    '!**/node_modules/**',
    '!**/__stubs__/**',
    '!**/__fixture__/**',
    '!integration/*',
  ],
};

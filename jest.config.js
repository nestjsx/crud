module.exports = {
  moduleNameMapper: {
    '^@nestjsx/(.+)': '<rootDir>/packages/$1/src',
  },
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '\\.spec.ts$',
  rootDir: '.',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
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
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

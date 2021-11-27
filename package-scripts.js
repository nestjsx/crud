const utils = require('nps-utils');

const getSeries = (args) => utils.series.nps(...args);
const names = ['util', 'crud-request', 'crud', 'crud-typeorm'];

const getBuildCmd = (pkg) => {
  const str = 'npx lerna run build';
  const scoped = (name) => `--scope @rewiko/${name}`;
  return pkg ? `${str} ${scoped(pkg)}` : getSeries(names.map((name) => `build.${name}`));
};

const getCleanCmd = (pkg) => {
  const cmd = `npx rimraf ./packages/${pkg}/lib && npx rimraf ./packages/${pkg}/tsconfig.tsbuildinfo`;
  return pkg ? cmd : getSeries(names.map((name) => `clean.${name}`));
};

const getTestCmd = (pkg, coverage) =>
  `npx jest --runInBand -c=jest.config.js packages/${pkg ? pkg + '/' : ''} ${
    coverage ? '--coverage' : ''
  } --verbose`;

const setBuild = () =>
  names.reduce((a, c) => ({ ...a, [c]: getBuildCmd(c) }), {
    default: getBuildCmd(),
  });

const setClean = () =>
  names.reduce((a, c) => ({ ...a, [c]: getCleanCmd(c) }), {
    default: getCleanCmd(),
  });

const setTest = () =>
  names.reduce((a, c) => ({ ...a, [c]: getTestCmd(c) }), {
    default: getTestCmd(false, true),
    coveralls: getTestCmd(false, true) + ' --coverageReporters=text-lcov | coveralls',
  });

module.exports = {
  scripts: {
    test: setTest(),
    build: setBuild(),
    clean: setClean(),
  },
};

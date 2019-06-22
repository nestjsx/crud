const { readdirSync } = require('fs');
const { join } = require('path');
const utils = require('nps-utils');

const getSeries = (args) => utils.series.nps(...args);
const names = ['util', 'crud-request', 'crud'];
const packagesNames = readdirSync(join(__dirname, './packages'));

packagesNames.forEach((name) => {
  if (!names.includes(name)) {
    names.push(name);
  }
});

const getBuildCmd = (pkg) => {
  const str = 'npx lerna run build';
  const scoped = (name) => `--scope @nestjsx/${name}`;
  return pkg ? `${str} ${scoped(pkg)}` : getSeries(names.map((name) => `build.${name}`));
};

const getTestCmd = (pkg, coverage) =>
  `npx jest -c=jest.config.js packages/${pkg ? pkg + '/' : ''} ${
    coverage ? '--coverage' : ''
  } --verbose`;

const setBuild = () =>
  names.reduce((a, c) => ({ ...a, [c]: getBuildCmd(c) }), {
    default: getBuildCmd(),
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
  },
};

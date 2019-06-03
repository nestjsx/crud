const utils = require('nps-utils');
const { readdirSync } = require('fs');
const { join } = require('path');

const packagesPath = join(__dirname, './packages');
const packagesNames = readdirSync(packagesPath);

const getSeries = (args) => utils.series.nps(...args);

const getBuildCmd = (pkg) => {
  const str = 'npx lerna run build';
  const scoped = (name) => `--scope @nestjsx/${name}`;
  return pkg
    ? `${str} ${scoped(pkg)}`
    : packagesNames.reduce((a, c) => `${a} ${scoped(c)}`, str);
};

const getTestUnitCmd = (pkg, coverage) =>
  `npx jest -c=jest.config.js packages/${pkg ? pkg + '/' : ''} ${
    coverage ? '--coverage' : ''
  } --verbose`;

const setBuild = () =>
  packagesNames.reduce((a, c) => ({ ...a, [c]: getBuildCmd(c) }), {
    default: getBuildCmd(),
  });

const setTestUnit = () =>
  packagesNames.reduce((a, c) => ({ ...a, [c]: getTestUnitCmd(c) }), {
    default: getTestUnitCmd(false, true),
  });

const setTest = () => ({
  default: getSeries(['test.unit']),
  unit: setTestUnit(),
});

module.exports = {
  scripts: {
    test: setTest(),
    build: setBuild(),
  },
};

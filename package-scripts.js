const { readdirSync } = require('fs');
const { join } = require('path');

const packagesPath = join(__dirname, './packages');
const packagesNames = readdirSync(packagesPath);

const getBuildCmd = (pkg) => {
  const str = 'npx lerna run build';
  const scoped = (name) => `--scope @nestjsx/${name}`;
  return pkg
    ? `${str} ${scoped(pkg)}`
    : packagesNames.reduce((a, c) => `${a} ${scoped(c)}`, str);
};

const getTestCmd = (pkg, coverage) =>
  `npx jest -c=jest.config.js packages/${pkg ? pkg + '/' : ''} ${
    coverage ? '--coverage' : ''
  } --verbose`;

const setBuild = () =>
  packagesNames.reduce((a, c) => ({ ...a, [c]: getBuildCmd(c) }), {
    default: getBuildCmd(),
  });

const setTest = () =>
  packagesNames.reduce((a, c) => ({ ...a, [c]: getTestCmd(c) }), {
    default: getTestCmd(false, true),
  });

module.exports = {
  scripts: {
    test: setTest(),
    build: setBuild(),
  },
};

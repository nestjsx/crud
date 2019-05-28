import { join } from 'path';

import { requireSafe } from '../src/require';

const stubsFolder = join(__dirname, './__stubs__');
const fileName = 'test-require.ts';
const filePath = join(stubsFolder, fileName);
const expectedContent = { test: { foo: 'bar' } };

describe('#util', () => {
  describe('#require', () => {
    describe('#requireSafe', () => {
      it('should be a function', () => {
        expect(typeof requireSafe).toBe('function');
      });
      it('should return an error', async () => {
        const test = await requireSafe('invalid', new Error());
        expect(test[0]).toBeInstanceOf(Error);
      });
      it('should return required file module', async () => {
        const test = await requireSafe(filePath);
        expect(test[0]).toBeUndefined();
        expect(test[1]).toMatchObject(expectedContent);
      });
    });
  });
});

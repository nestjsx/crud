import { objKeys, getOwnPropNames } from '../src';

describe('#util', () => {
  describe('#objKeys', () => {
    it('should return array of strings', () => {
      const obj = { foo: 1, bar: 1 };
      const keys = ['foo', 'bar'];
      expect(objKeys(obj)).toMatchObject(keys);
    });
  });

  describe('#getOwnPropNames', () => {
    it('should return own properties', () => {
      class Parent {
        foo = 1;
      }
      class Child extends Parent {
        bar = 1;
      }
      const expected = ['foo', 'bar'];
      expect(getOwnPropNames(new Child())).toMatchObject(expected);
    });
  });
});

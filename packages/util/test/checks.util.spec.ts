import {
  isUndefined,
  isNull,
  isNil,
  isString,
  hasLength,
  isStringFull,
  isArrayFull,
  isArrayStrings,
  isObject,
  isObjectFull,
  isNumber,
  isEqual,
  isFalse,
  isTrue,
  isIn,
} from '../src/';

describe('#util', () => {
  describe('#isUndefined', () => {
    it('should return true', () => {
      expect(isUndefined(undefined)).toBe(true);
    });
    it('should return false', () => {
      expect(isUndefined(null)).toBe(false);
    });
  });

  describe('#isNull', () => {
    it('should reurn true', () => {
      expect(isNull(null)).toBe(true);
    });
    it('should return false', () => {
      expect(isNull(NaN)).toBe(false);
    });
  });

  describe('#isNil', () => {
    it('should return true', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });
    it('should return false', () => {
      expect(isNil(NaN)).toBe(false);
    });
  });

  describe('#isString', () => {
    it('should return true', () => {
      expect(isString('test')).toBe(true);
    });
    it('should return false', () => {
      expect(isString(null)).toBe(false);
    });
  });

  describe('#hasLength', () => {
    it('should return true', () => {
      expect(hasLength('test')).toBe(true);
      expect(hasLength([1])).toBe(true);
    });
    it('should return false', () => {
      expect(hasLength({})).toBe(false);
      expect(hasLength('')).toBe(false);
      expect(hasLength([])).toBe(false);
    });
  });

  describe('#isStringFull', () => {
    it('should return true', () => {
      expect(isStringFull('test')).toBe(true);
    });
    it('should return false', () => {
      expect(isStringFull('')).toBe(false);
      expect(isStringFull([])).toBe(false);
    });
  });

  describe('#isArrayFull', () => {
    it('should return true', () => {
      expect(isArrayFull([1])).toBe(true);
    });
    it('should return false', () => {
      expect(isArrayFull([])).toBe(false);
    });
  });

  describe('#isArrayStrings', () => {
    it('should return true', () => {
      expect(isArrayStrings(['1', 'true'])).toBe(true);
    });
    it('should return false', () => {
      expect(isArrayStrings([])).toBe(false);
    });
  });

  describe('#isObject', () => {
    it('should return true', () => {
      expect(isObject({})).toBe(true);
    });
    it('should return false', () => {
      expect(isObject(1)).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe('#isObjectFull', () => {
    it('should return true', () => {
      expect(isObjectFull({ foo: 1 })).toBe(true);
    });
    it('should return false', () => {
      expect(isObjectFull({})).toBe(false);
    });
  });

  describe('#isNumber', () => {
    it('should return true', () => {
      expect(isNumber(1)).toBe(true);
    });
    it('should return false', () => {
      expect(isNumber(true)).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
    });
  });

  describe('#isEqual', () => {
    it('should return true', () => {
      expect(isEqual(1, 1)).toBe(true);
    });
    it('should return false', () => {
      expect(isEqual(1, 2)).toBe(false);
    });
  });

  describe('#isFalse', () => {
    it('should return true', () => {
      expect(isFalse(false)).toBe(true);
    });
    it('should return false', () => {
      expect(isFalse(1)).toBe(false);
    });
  });

  describe('#isTrue', () => {
    it('should return true', () => {
      expect(isTrue(true)).toBe(true);
    });
    it('should return false', () => {
      expect(isTrue(1)).toBe(false);
    });
  });

  describe('#isIn', () => {
    it('should return true', () => {
      expect(isIn(1, [1, 2])).toBe(true);
    });
    it('should return false', () => {
      expect(isIn(1, [])).toBe(false);
      expect(isIn(1)).toBe(false);
    });
  });
});

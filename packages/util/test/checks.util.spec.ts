import {
  hasLength,
  hasValue,
  isArrayFull,
  isArrayStrings,
  isBoolean,
  isDate,
  isDateString,
  isEqual,
  isFalse,
  isFunction,
  isIn,
  isNil,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isObjectFull,
  isString,
  isStringFull,
  isTrue,
  isUndefined,
  isValue,
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

  describe('#isBoolean', () => {
    it('should return true', () => {
      for (const val of [true, false]) {
        expect(isBoolean(val)).toBe(true);
      }
    });
    it('should return false', () => {
      for (const val of [1, null, undefined, {}, [], NaN]) {
        expect(isBoolean(val)).toBe(false);
      }
    });
  });

  describe('#isNumeric', () => {
    it('should return true', () => {
      for (const val of [1, 0, '123', '-9.6']) {
        expect(isNumeric(val)).toBe(true);
      }
    });
    it('should return false', () => {
      for (const val of ['', [], {}, null, undefined]) {
        expect(isNumeric(val)).toBe(false);
      }
    });
  });

  describe('#isDateString', () => {
    it('should return true', () => {
      for (const val of [
        '2019-06-19',
        '2019-06-19T12:30:00',
        '2019-06-19T12:30:00+0800',
        '2019-06-19T12:30:00-08:00',
        '2019-06-19T00:00:00Z',
      ]) {
        expect(isDateString(val)).toBe(true);
      }
    });
    it('should return false', () => {
      for (const val of ['product-123123', 'CG-7', '20190619', [], {}, null, undefined]) {
        expect(isDateString(val)).toBe(false);
      }
    });
  });

  describe('#isDate', () => {
    it('should return true', () => {
      for (const val of [new Date()]) {
        expect(isDate(val)).toBe(true);
      }
    });
    it('should return false', () => {
      for (const val of ['2019-06-19', [], {}, null, undefined]) {
        expect(isDate(val)).toBe(false);
      }
    });
  });

  describe('#isValue', () => {
    it('should return true', () => {
      for (const val of [new Date(), 'test', -1, 0, true, false]) {
        expect(isValue(val)).toBe(true);
      }
    });
    it('should return false', () => {
      for (const val of ['', [], {}, null, undefined]) {
        expect(isValue(val)).toBe(false);
      }
    });
  });

  describe('#hasValue', () => {
    it('should return true', () => {
      expect(hasValue([new Date(), 'test', -1, 0, true, false])).toBe(true);
      expect(hasValue(false)).toBe(true);
    });
    it('should return false', () => {
      expect(hasValue(['', [], {}, null, undefined])).toBe(false);
      expect(hasValue(null)).toBe(false);
    });
  });

  describe('#isFunction', () => {
    it('should return true', () => {
      expect(isFunction(Date)).toBe(true);
    });
    it('should return false', () => {
      expect(isFunction(new Date())).toBe(false);
    });
  });
});

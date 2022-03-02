"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obj_util_1 = require("./obj.util");
exports.isUndefined = (val) => typeof val === 'undefined';
exports.isNull = (val) => val === null;
exports.isNil = (val) => exports.isUndefined(val) || exports.isNull(val);
exports.isString = (val) => typeof val === 'string';
exports.hasLength = (val) => val.length > 0;
exports.isStringFull = (val) => exports.isString(val) && exports.hasLength(val);
exports.isArrayFull = (val) => Array.isArray(val) && exports.hasLength(val);
exports.isArrayStrings = (val) => exports.isArrayFull(val) && val.every((v) => exports.isStringFull(v));
exports.isObject = (val) => typeof val === 'object' && !exports.isNull(val);
exports.isObjectFull = (val) => exports.isObject(val) && exports.hasLength(obj_util_1.objKeys(val));
exports.isNumber = (val) => typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val);
exports.isEqual = (val, eq) => val === eq;
exports.isFalse = (val) => val === false;
exports.isTrue = (val) => val === true;
exports.isIn = (val, arr = []) => arr.some((o) => exports.isEqual(val, o));
exports.isBoolean = (val) => typeof val === 'boolean';
exports.isNumeric = (val) => /^[+-]?([0-9]*[.])?[0-9]+$/.test(val);
exports.isDateString = (val) => exports.isStringFull(val) &&
    /^\d{4}-[01]\d-[0-3]\d(?:T[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[-+][0-2]\d(?::?[0-5]\d)?)?)?$/g.test(val);
exports.isDate = (val) => val instanceof Date;
exports.isValue = (val) => exports.isStringFull(val) || exports.isNumber(val) || exports.isBoolean(val) || exports.isDate(val);
exports.hasValue = (val) => exports.isArrayFull(val) ? val.every((o) => exports.isValue(o)) : exports.isValue(val);
exports.isFunction = (val) => typeof val === 'function';
//# sourceMappingURL=checks.util.js.map
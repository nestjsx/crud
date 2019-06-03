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
//# sourceMappingURL=checks.util.js.map
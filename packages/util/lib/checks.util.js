"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefined = (val) => typeof val === 'undefined';
exports.isNull = (val) => val === null;
exports.isNil = (val) => exports.isUndefined(val) || exports.isNull(val);
exports.isString = (val) => typeof val === 'string';
exports.hasLength = (val) => val.length > 0;
exports.isStringFull = (val) => exports.isString(val) && exports.hasLength(val);
exports.isArrayFull = (val) => Array.isArray(val) && exports.hasLength(val);
exports.isArrayStrings = (val) => exports.isArrayFull(val) && val.every((v) => exports.isStringFull(v));
exports.objKeys = (val) => Object.keys(val);
exports.isObject = (val) => typeof val === 'object' && !exports.isNull(val);
exports.isObjectFull = (val) => exports.isObject(val) && exports.hasLength(exports.objKeys(val));
exports.isNumber = (val) => typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val);
exports.isEqual = (val, eq) => val === eq;
//# sourceMappingURL=checks.util.js.map
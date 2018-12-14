"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let classValidator;
let classTransformer;
let typeorm;
try {
    classValidator = require('class-validator');
}
catch (error) { }
try {
    classTransformer = require('class-transformer');
}
catch (error) { }
try {
    typeorm = require('typeorm/decorator/entity/Entity');
}
catch (error) { }
exports.hasValidator = !!classValidator;
exports.hasTypeorm = !!typeorm;
exports.isArrayFull = (obj) => Array.isArray(obj) && obj.length !== 0;
exports.mockValidatorDecorator = (name) => classValidator && classValidator[name]
    ? classValidator[name]
    : (...args) => (target, key) => { };
exports.mockTransformerDecorator = (name) => classTransformer && classTransformer[name]
    ? classTransformer[name]
    : (...args) => (target, key) => { };
//# sourceMappingURL=utils.js.map
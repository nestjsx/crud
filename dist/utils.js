"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let classValidatorPkg;
let classTransformerPkg;
let typeormPkg;
let swaggerPkg;
try {
    classValidatorPkg = require('class-validator');
}
catch (error) { }
try {
    classTransformerPkg = require('class-transformer');
}
catch (error) { }
try {
    typeormPkg = require('typeorm/decorator/entity/Entity');
}
catch (error) { }
try {
    swaggerPkg = require('@nestjs/swagger/dist/constants');
}
catch (error) { }
exports.swagger = swaggerPkg ? swaggerPkg : null;
exports.hasValidator = !!classValidatorPkg;
exports.hasTypeorm = !!typeormPkg;
exports.isArrayFull = (obj) => Array.isArray(obj) && obj.length !== 0;
exports.mockValidatorDecorator = (name) => classValidatorPkg && classValidatorPkg[name]
    ? classValidatorPkg[name]
    : (...args) => (target, key) => { };
exports.mockTransformerDecorator = (name) => classTransformerPkg && classTransformerPkg[name]
    ? classTransformerPkg[name]
    :
        (...args) => (target, key) => { };
//# sourceMappingURL=utils.js.map
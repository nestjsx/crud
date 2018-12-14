let classValidator: any;
let classTransformer: any;
let typeorm: any;

try {
  classValidator = require('class-validator');
} catch (error) {}
try {
  classTransformer = require('class-transformer');
} catch (error) {}
try {
  typeorm = require('typeorm/decorator/entity/Entity');
} catch (error) {}

export const hasValidator = !!classValidator;
export const hasTypeorm = !!typeorm;

export const isArrayFull = (obj) => Array.isArray(obj) && obj.length !== 0;

export const mockValidatorDecorator = (name: string) =>
  classValidator && classValidator[name]
    ? classValidator[name]
    : (...args: any[]) => (target, key) => {};
export const mockTransformerDecorator = (name: string) =>
  classTransformer && classTransformer[name]
    ? classTransformer[name]
    : (...args: any[]) => (target, key) => {};

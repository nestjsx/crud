let classValidator: any;
let classTransformer: any;

try {
  classValidator = require('class-validator');
  classTransformer = require('class-transformer');
} catch (error) {}

export const isArrayFull = (obj) => Array.isArray(obj) && obj.length !== 0;

export const mockValidatorDecorator = (name: string) =>
  classValidator && classValidator[name]
    ? classValidator[name]
    : (...args: any[]) => (target, key) => {};
export const mockTransformerDecorator = (name: string) =>
  classTransformer && classTransformer[name]
    ? classTransformer[name]
    : (...args: any[]) => (target, key) => {};

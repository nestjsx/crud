let classValidatorPkg: any;
let classTransformerPkg: any;
let typeormPkg: any;
let swaggerPkg: any;

try {
  classValidatorPkg = require('class-validator');
} catch (error) { }
try {
  classTransformerPkg = require('class-transformer');
} catch (error) { }
try {
  typeormPkg = require('typeorm/decorator/entity/Entity');
} catch (error) { }
try {
  swaggerPkg = require('@nestjs/swagger/dist/constants');
} catch (error) { }

export const swagger = swaggerPkg ? swaggerPkg : null;
export const hasValidator = !!classValidatorPkg;
export const hasTypeorm = !!typeormPkg;

export const isArrayFull = (obj) => Array.isArray(obj) && obj.length !== 0;
export const mockValidatorDecorator = (name: string) =>
  classValidatorPkg && classValidatorPkg[name]
    ? classValidatorPkg[name]
    : (...args: any[]) => (target, key) => { };
export const mockTransformerDecorator = (name: string) =>
  classTransformerPkg && classTransformerPkg[name]
    ? classTransformerPkg[name]
    : (...args: any[]) => (target, key) => { };
export const toObjectId = (id: string) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId(id);
};

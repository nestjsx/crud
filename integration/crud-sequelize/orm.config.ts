import { Op } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notin: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notlike: Op.notLike,
  $ilike: Op.iLike,
  $notILike: Op.notILike,
  $between: Op.between,
  $notbetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

export const config: SequelizeOptions = {
  dialect: 'postgres',
  host: '127.0.0.1',
  port: 5456,
  username: 'root',
  password: 'root',
  database: 'nestjsx_crud_sequelize',
  logging: false,
  define: {
    underscored: true,
    paranoid: false,
    timestamps: true,
    freezeTableName: false
  },
  operatorsAliases
};

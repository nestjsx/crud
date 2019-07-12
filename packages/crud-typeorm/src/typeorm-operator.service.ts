import { CondOperator } from '@nestjsx/crud-request';

type Cond = [string, any?];
type TemplateFn = (field: string, param?: string, value?: any) => Cond;

interface IOperatorService {
  [CondOperator.EQUALS]: TemplateFn;
  [CondOperator.NOT_EQUALS]: TemplateFn;
  [CondOperator.GREATER_THAN]: TemplateFn;
  [CondOperator.LOWER_THAN]: TemplateFn;
  [CondOperator.GREATER_THAN_EQUALS]: TemplateFn;
  [CondOperator.LOWER_THAN_EQAULS]: TemplateFn;
  [CondOperator.STARTS]: TemplateFn;
  [CondOperator.ENDS]: TemplateFn;
  [CondOperator.CONTAINS]: TemplateFn;
  [CondOperator.EXCLUDES]: TemplateFn;
  [CondOperator.IN]: TemplateFn;
  [CondOperator.NOT_IN]: TemplateFn;
  [CondOperator.IS_NULL]: TemplateFn;
  [CondOperator.NOT_NULL]: TemplateFn;
  [CondOperator.BETWEEN]: TemplateFn;
}

export class TypeormOperatorService implements IOperatorService {
  [CondOperator.EQUALS] = (field: string, param: string) =>
    [`${field} = :${param}`] as Cond;
  [CondOperator.NOT_EQUALS] = (field: string, param: string) =>
    [`${field} != :${param}`] as Cond;
  [CondOperator.GREATER_THAN] = (field: string, param: string) =>
    [`${field} > :${param}`] as Cond;
  [CondOperator.LOWER_THAN] = (field: string, param: string) =>
    [`${field} < :${param}`] as Cond;
  [CondOperator.GREATER_THAN_EQUALS] = (field: string, param: string) =>
    [`${field} >= :${param}`] as Cond;
  [CondOperator.LOWER_THAN_EQAULS] = (field: string, param: string) =>
    [`${field} <= :${param}`] as Cond;
  [CondOperator.STARTS] = (field: string, param: string, value: any) =>
    [`${field} LIKE :${param}`, { [param]: `${value}%` }] as Cond;
  [CondOperator.ENDS] = (field: string, param: string, value: any) =>
    [`${field} LIKE :${param}`, { [param]: `%${value}` }] as Cond;
  [CondOperator.CONTAINS] = (field: string, param: string, value: any) =>
    [`${field} LIKE :${param}`, { [param]: `%${value}%` }] as Cond;
  [CondOperator.EXCLUDES] = (field: string, param: string, value: any) =>
    [`${field} NOT LIKE :${param}`, { [param]: `%${value}%` }] as Cond;
  [CondOperator.IN] = (field: string, param: string) =>
    [`${field} IN (:...${param})`] as Cond;
  [CondOperator.NOT_IN] = (field: string, param: string) =>
    [`${field} NOT IN (:...${param})`] as Cond;
  [CondOperator.IS_NULL] = (field: string) => [`${field} IS NULL`, {}] as Cond;
  [CondOperator.NOT_NULL] = (field: string) => [`${field} IS NOT NULL`, {}] as Cond;
  [CondOperator.BETWEEN] = (field: string, param: string, value: any[]) =>
    [
      `${field} BETWEEN :${param}0 AND :${param}1`,
      {
        [`${param}0`]: value[0],
        [`${param}1`]: value[1],
      },
    ] as Cond;
}

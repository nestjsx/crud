import { CrudValidate } from './enums/crud-validate.enum';

export const FEAUTURE_NAME_METADATA = 'NESTJSX_FEAUTURE_NAME_METADATA';
export const ACTION_NAME_METADATA = 'NESTJSX_ACTION_NAME_METADATA';
export const OVERRIDE_METHOD_METADATA = 'NESTJSX_OVERRIDE_METHOD_METADATA';

export const CREATE_UPDATE: { groups: string[] } = {
  groups: [CrudValidate.CREATE, CrudValidate.UPDATE],
};
export const CREATE: { groups: string[] } = { groups: [CrudValidate.CREATE] };
export const UPDATE: { groups: string[] } = { groups: [CrudValidate.UPDATE] };

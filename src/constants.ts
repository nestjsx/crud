import { CrudValidate } from './enums/crud-validate.enum';

export const FEAUTURE_NAME_METADATA = 'NESTJSX_FEAUTURE_NAME_METADATA';
export const ACTION_NAME_METADATA = 'NESTJSX_ACTION_NAME_METADATA';
export const OVERRIDE_METHOD_METADATA = 'NESTJSX_OVERRIDE_METHOD_METADATA';
export const PARSED_QUERY_REQUEST_KEY = 'NESTJSX_PARSED_QUERY_REQUEST_KEY';
export const PARSED_PARAMS_REQUEST_KEY = 'NESTJSX_PARSED_PARAMS_REQUEST_KEY';
export const PARSED_OPTIONS_METADATA = 'NESTJSX_PARSED_OPTIONS_METADATA';
export const PARSED_BODY_METADATA = 'NESTJSX_PARSED_BODY_METADATA';
export const CRUD_OPTIONS_METADATA = 'NESTJSX_CRUD_OPTIONS_METADATA';

export const CREATE_UPDATE: { groups: string[] } = {
  groups: [CrudValidate.CREATE, CrudValidate.UPDATE],
};
export const CREATE: { groups: string[] } = { groups: [CrudValidate.CREATE] };
export const UPDATE: { groups: string[] } = { groups: [CrudValidate.UPDATE] };

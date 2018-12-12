import { ReflectMetadata } from '@nestjs/common';

import { FEAUTURE_NAME_METADATA, ACTION_NAME_METADATA } from '../constants';
// import { CrudActions } from '../enums';

export const Feature = (name: string) => ReflectMetadata(FEAUTURE_NAME_METADATA, name);
export const Action = (name: string) => ReflectMetadata(ACTION_NAME_METADATA, name);
// export const ReadAll = () => Action(CrudActions.ReadAll);
// export const ReadOne = () => Action(CrudActions.ReadOne);
// export const CreateMany = () => Action(CrudActions.CreateMany);
// export const CreateOne = () => Action(CrudActions.CreateOne);
// export const UpdateOne = () => Action(CrudActions.UpdateOne);
// export const DeleteOne = () => Action(CrudActions.DeleteOne);
// export const DeleteAll = () => Action(CrudActions.DeleteAll);

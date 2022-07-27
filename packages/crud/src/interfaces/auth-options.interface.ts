import { SCondition } from '@vianneybr/nestjsx-crud-request/lib/types/request-query.types';
import { ObjectLiteral } from '@vianneybr/nestjsx-util';

export interface AuthGlobalOptions {
  property?: string;
}

export interface AuthOptions {
  property?: string;
  filter?: (req: any) => SCondition | void;
  or?: (req: any) => SCondition | void;
  persist?: (req: any) => ObjectLiteral;
}

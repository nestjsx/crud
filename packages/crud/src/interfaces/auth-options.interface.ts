import { ObjectLiteral } from '@nestjsx/util';

export interface AuthGlobalOptions {
  property?: string;
}

export interface AuthOptions {
  property?: string;
  filter?: (req: any) => ObjectLiteral;
  persist?: (req: any) => ObjectLiteral;
}

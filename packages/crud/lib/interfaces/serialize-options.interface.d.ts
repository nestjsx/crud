import { Type } from '@nestjs/common';
export interface SerializeOptions {
    getMany?: Type<any> | false;
    get?: Type<any> | false;
    create?: Type<any> | false;
    createMany?: Type<any> | false;
    update?: Type<any> | false;
    replace?: Type<any> | false;
    delete?: Type<any> | false;
    recover?: Type<any> | false;
}

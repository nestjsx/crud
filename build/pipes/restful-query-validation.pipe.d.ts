import { PipeTransform } from '@nestjs/common';
export declare class RestfulQueryValidationPipe implements PipeTransform {
    transform(value: any): Promise<any>;
}

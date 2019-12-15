import { GetManyDefaultResponse } from '../interfaces';
import { safeRequire } from '../util';
import { ApiProperty } from './swagger.helper';

const transformer = safeRequire('class-transformer');

export class SerializeHelper {
  static createGetManyDto(dto: any, resourceName: string): any {
    const { Type } = transformer;

    class GetManyResponseDto implements GetManyDefaultResponse<any> {
      @ApiProperty({ type: dto, isArray: true })
      @Type(() => dto)
      data: any[];

      @ApiProperty({ type: 'number' })
      count: number;

      @ApiProperty({ type: 'number' })
      total: number;

      @ApiProperty({ type: 'number' })
      page: number;

      @ApiProperty({ type: 'number' })
      pageCount: number;
    }

    Object.defineProperty(GetManyResponseDto, 'name', {
      writable: false,
      value: `GetMany${resourceName}ResponseDto`,
    });

    return GetManyResponseDto;
  }
}

import { Expose, Type } from 'class-transformer';

import { GetManyDefaultResponse } from '../interfaces';
import { ApiProperty } from './swagger.helper';

export class SerializeHelper {
  static createGetManyDto(dto: any, resourceName: string): any {
    class GetManyResponseDto implements GetManyDefaultResponse<any> {
      @ApiProperty({ type: dto, isArray: true })
      @Type(() => dto)
      @Expose()
      data: any[];

      @ApiProperty({ type: 'number' })
      @Expose()
      count: number;

      @ApiProperty({ type: 'number' })
      @Expose()
      total: number;

      @ApiProperty({ type: 'number' })
      @Expose()
      page: number;

      @ApiProperty({ type: 'number' })
      @Expose()
      pageCount: number;
    }

    Object.defineProperty(GetManyResponseDto, 'name', {
      writable: false,
      value: `GetMany${resourceName}ResponseDto`,
    });

    return GetManyResponseDto;
  }

  static createGetOneResponseDto(resourceName: string): any {
    class GetOneResponseDto {}

    Object.defineProperty(GetOneResponseDto, 'name', {
      writable: false,
      value: `${resourceName}ResponseDto`,
    });

    return GetOneResponseDto;
  }
}

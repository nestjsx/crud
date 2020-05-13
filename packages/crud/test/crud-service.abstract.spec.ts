import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TestService } from './__fixture__/services';

describe('#crud', () => {
  describe('#CrudService', () => {
    let service: TestService<any>;

    beforeAll(() => {
      service = new TestService();
    });

    describe('#throwBadRequestException', () => {
      it('should throw BadRequestException', () => {
        expect(service.throwBadRequestException.bind(service, '')).toThrowError(
          BadRequestException,
        );
      });
    });

    describe('#throwNotFoundException', () => {
      it('should throw NotFoundException', () => {
        expect(service.throwNotFoundException.bind(service, '')).toThrowError(
          NotFoundException,
        );
      });
    });

    describe('#createPageInfo', () => {
      it('should return an object', () => {
        const expected = {
          count: 0,
          data: [],
          page: 2,
          pageCount: 10,
          total: 100,
        };
        expect(service.createPageInfo([], 100, 10, 10)).toMatchObject(expected);
      });

      it('should return an object when limit and offset undefined', () => {
        const expected = {
          count: 0,
          data: [],
          page: 1,
          pageCount: 1,
          total: 100,
        };
        expect(service.createPageInfo([], 100, undefined, undefined)).toMatchObject(
          expected,
        );
      });
    });
  });
});

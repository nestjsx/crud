import { RequestQueryBuilder } from '../src/request-query.builder';
import { RequestQueryException } from '../src/exceptions/request-query.exception';
import {
  QueryFields,
  QueryFilter,
  QueryJoin,
  QuerySort,
  CondOperator,
} from '../src/types';

const defaultOptions = { ...(RequestQueryBuilder as any)._options };

describe('#request-query', () => {
  describe('#RequestQueryBuilder', () => {
    let qb: RequestQueryBuilder;

    beforeEach(() => {
      qb = RequestQueryBuilder.create();
    });

    afterEach(() => {
      (RequestQueryBuilder as any)._options = defaultOptions;
    });

    it('should be a function', () => {
      expect(typeof RequestQueryBuilder).toBe('function');
    });

    describe('#static setOptions', () => {
      it('should merge options, 1', () => {
        const override = 'override';
        RequestQueryBuilder.setOptions({
          paramNamesMap: { fields: [override] },
        });
        const paramNamesMap = (RequestQueryBuilder as any)._options.paramNamesMap;
        expect(paramNamesMap.fields[0]).toBe(override);
        expect(paramNamesMap.page).toBe('page');
      });
      it('should merge options, 2', () => {
        const override = 'override';
        RequestQueryBuilder.setOptions({ delim: override });
        const _options = (RequestQueryBuilder as any)._options;
        expect(_options.delim).toBe(override);
      });
    });

    describe('#select', () => {
      it('should throw an error', () => {
        expect(qb.select as any).toThrowError(RequestQueryException);
      });
      it('should set _fields', () => {
        const expected: QueryFields = ['foo', 'bar'];
        qb.select(expected);
        expect((qb as any)._fields).toMatchObject(expected);
      });
    });

    describe('#setFilter', () => {
      it('should throw an error, 1', () => {
        expect(qb.setFilter as any).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        expect((qb.setFilter as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect(
          (qb.setFilter as any).bind(qb, { field: 'foo', operator: 'bar' }),
        ).toThrowError(RequestQueryException);
      });
      it('should set _filter', () => {
        const expected: QueryFilter = { field: 'foo', operator: CondOperator.EQUALS };
        qb.setFilter(expected);
        expect((qb as any)._filter[0]).toMatchObject(expected);
      });
    });

    describe('#setOr', () => {
      it('should throw an error, 1', () => {
        expect(qb.setOr as any).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        expect((qb.setOr as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect(
          (qb.setOr as any).bind(qb, { field: 'foo', operator: 'bar' }),
        ).toThrowError(RequestQueryException);
      });
      it('should set _or', () => {
        const expected: QueryFilter = { field: 'foo', operator: 'eq' };
        qb.setOr(expected);
        expect((qb as any)._or[0]).toMatchObject(expected);
      });
    });

    describe('#setJoin', () => {
      it('should throw an error, 1', () => {
        expect(qb.setJoin as any).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        expect((qb.setJoin as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect((qb.setJoin as any).bind(qb, { field: 'foo', select: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should set _join', () => {
        const expected: QueryJoin = { field: 'foo', select: ['bar'] };
        qb.setJoin(expected);
        expect((qb as any)._join[0]).toMatchObject(expected);
      });
    });

    describe('#sortBy', () => {
      it('should throw an error, 1', () => {
        expect(qb.sortBy as any).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        expect((qb.sortBy as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect((qb.sortBy as any).bind(qb, { field: 'foo', order: 'bar' })).toThrowError(
          RequestQueryException,
        );
      });
      it('should set _sort', () => {
        const expected: QuerySort = { field: 'foo', order: 'ASC' };
        qb.sortBy(expected);
        expect((qb as any)._sort[0]).toMatchObject(expected);
      });
    });

    describe('#setLimit', () => {
      it('should throw an error', () => {
        expect(qb.setLimit as any).toThrowError(RequestQueryException);
      });
      it('should set _limit', () => {
        const expected = 10;
        qb.setLimit(expected);
        expect((qb as any)._limit).toBe(expected);
      });
    });

    describe('#setOffset', () => {
      it('should throw an error', () => {
        expect(qb.setOffset as any).toThrowError(RequestQueryException);
      });
      it('should set _offset', () => {
        const expected = 10;
        qb.setOffset(expected);
        expect((qb as any)._offset).toBe(expected);
      });
    });

    describe('#setPage', () => {
      it('should throw an error', () => {
        expect(qb.setPage as any).toThrowError(RequestQueryException);
      });
      it('should set _page', () => {
        const expected = 10;
        qb.setPage(expected);
        expect((qb as any)._page).toBe(expected);
      });
    });

    describe('#resetCache', () => {
      it('should set _cache', () => {
        const expected = 0;
        qb.resetCache();
        expect((qb as any)._cache).toBe(expected);
      });
    });

    describe('#query', () => {
      it('should return an empty string', () => {
        expect(qb.query()).toBe('');
      });
      it('should return query with overrided fields name', () => {
        RequestQueryBuilder.setOptions({ paramNamesMap: { fields: ['override'] } });
        const test = qb.select(['foo', 'bar']).query();
        const expected = 'override=foo,bar';
        expect(test).toBe(expected);
      });
      it('should return query with filter conditions, 1', () => {
        const test = qb
          .setFilter({ field: 'foo', operator: 'eq', value: 'test' })
          .setFilter({ field: 'bar', operator: 'notnull' })
          .query();
        const expected = 'filter[]=foo||eq||test&filter[]=bar||notnull';
        expect(test).toBe(expected);
      });
      it('should return query with filter conditions, 2', () => {
        const test = qb
          .setFilter({ field: 'foo', operator: 'eq', value: 'test' })
          .query();
        const expected = 'filter=foo||eq||test';
        expect(test).toBe(expected);
      });
      it('should return query with or conditions', () => {
        const test = qb
          .setOr({ field: 'foo', operator: 'eq', value: 'test' })
          .setOr({ field: 'bar', operator: 'notnull' })
          .query();
        const expected = 'or[]=foo||eq||test&or[]=bar||notnull';
        expect(test).toBe(expected);
      });
      it('should return query with join', () => {
        const test = qb
          .setJoin({ field: 'foo' })
          .setJoin({ field: 'bar', select: ['test', 'test1'] })
          .query();
        const expected = 'join[]=foo&join[]=bar||test,test1';
        expect(test).toBe(expected);
      });
      it('should return query with sort', () => {
        const test = qb
          .sortBy({ field: 'foo', order: 'ASC' })
          .sortBy({ field: 'bar', order: 'DESC' })
          .query();
        const expected = 'sort[]=foo,ASC&sort[]=bar,DESC';
        expect(test).toBe(expected);
      });
      it('should return query with limit', () => {
        const test = qb.setLimit(10).query();
        const expected = 'per_page=10';
        expect(test).toBe(expected);
      });
      it('should return query with offset', () => {
        const test = qb.setOffset(10).query();
        const expected = 'offset=10';
        expect(test).toBe(expected);
      });
      it('should return query with page', () => {
        const test = qb.setPage(10).query();
        const expected = 'page=10';
        expect(test).toBe(expected);
      });
      it('should return query with cache', () => {
        const test = qb.resetCache().query();
        const expected = 'cache=0';
        expect(test).toBe(expected);
      });
    });
  });
});

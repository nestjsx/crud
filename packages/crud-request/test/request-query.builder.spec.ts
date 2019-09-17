import 'jest-extended';
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
      it('should not throw', () => {
        (qb as any).select();
        expect(qb.queryObject.fields).toBeUndefined();
      });
      it('should throw an error', () => {
        expect((qb.select as any).bind(qb, [false])).toThrowError(RequestQueryException);
      });
      it('should set fields', () => {
        qb.select(['foo', 'bar']);
        const expected = 'foo,bar';
        expect(qb.queryObject.fields).toBe(expected);
      });
    });

    describe('#setFilter', () => {
      it('should not throw', () => {
        (qb as any).setFilter();
        expect(qb.queryObject.filter).toBeUndefined();
      });
      it('should throw an error, 1', () => {
        expect((qb.setFilter as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 2', () => {
        expect(
          (qb.setFilter as any).bind(qb, { field: 'foo', operator: 'bar' }),
        ).toThrowError(RequestQueryException);
      });
      it('should throw an error, 3', () => {
        expect((qb.setFilter as any).bind(qb, [{}])).toThrowError(RequestQueryException);
      });
      it('should set filter, 1', () => {
        qb.setFilter({ field: 'foo', operator: 'eq', value: 'bar' });
        const expected = ['foo||eq||bar'];
        expect(qb.queryObject.filter).toIncludeSameMembers(expected);
      });
      it('should set filter, 2', () => {
        qb.setFilter([
          { field: 'foo', operator: 'eq', value: 'bar' },
          { field: 'baz', operator: 'ne', value: 'zoo' },
        ]);
        const expected = ['foo||eq||bar', 'baz||ne||zoo'];
        expect(qb.queryObject.filter).toIncludeSameMembers(expected);
      });
    });

    describe('#setOr', () => {
      it('should not throw', () => {
        (qb as any).setOr();
        expect(qb.queryObject.or).toBeUndefined();
      });
      it('should throw an error, 1', () => {
        expect((qb.setOr as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 2', () => {
        expect(
          (qb.setOr as any).bind(qb, { field: 'foo', operator: 'bar' }),
        ).toThrowError(RequestQueryException);
      });
      it('should throw an error, 3', () => {
        expect((qb.setOr as any).bind(qb, [{}])).toThrowError(RequestQueryException);
      });
      it('should set or, 1', () => {
        qb.setOr({ field: 'foo', operator: 'eq', value: 'bar' });
        const expected = ['foo||eq||bar'];
        expect(qb.queryObject.or).toIncludeSameMembers(expected);
      });
      it('should set or, 2', () => {
        qb.setOr([
          { field: 'foo', operator: 'eq', value: 'bar' },
          { field: 'baz', operator: 'ne', value: 'zoo' },
        ]);
        const expected = ['foo||eq||bar', 'baz||ne||zoo'];
        expect(qb.queryObject.or).toIncludeSameMembers(expected);
      });
    });

    describe('#setJoin', () => {
      it('should not throw', () => {
        (qb as any).setJoin();
        expect(qb.queryObject.join).toBeUndefined();
      });
      it('should throw an error, 1', () => {
        expect((qb.setJoin as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 2', () => {
        expect((qb.setJoin as any).bind(qb, { field: 'foo', select: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect((qb.setJoin as any).bind(qb, [{}])).toThrowError(RequestQueryException);
      });
      it('should set join, 1', () => {
        qb.setJoin({ field: 'foo' });
        const expected = ['foo'];
        expect(qb.queryObject.join).toIncludeSameMembers(expected);
      });
      it('should set join, 2', () => {
        qb.setJoin([{ field: 'foo' }, { field: 'bar', select: ['a', 'b', 'c'] }]);
        const expected = ['foo', 'bar||a,b,c'];
        expect(qb.queryObject.join).toIncludeSameMembers(expected);
      });
    });

    describe('#sortBy', () => {
      it('should not throw', () => {
        (qb as any).sortBy();
        expect(qb.queryObject.sort).toBeUndefined();
      });
      it('should throw an error, 1', () => {
        expect((qb.sortBy as any).bind(qb, { field: 1 })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 2', () => {
        expect((qb.sortBy as any).bind(qb, { field: 'foo', order: 'bar' })).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        expect((qb.sortBy as any).bind(qb, [{}])).toThrowError(RequestQueryException);
      });
      it('should set sort, 1', () => {
        qb.sortBy({ field: 'foo', order: 'ASC' });
        const expected = ['foo,ASC'];
        expect(qb.queryObject.sort).toIncludeSameMembers(expected);
      });
      it('should set sort, 2', () => {
        qb.sortBy([{ field: 'foo', order: 'ASC' }, { field: 'bar', order: 'DESC' }]);
        const expected = ['foo,ASC', 'bar,DESC'];
        expect(qb.queryObject.sort).toIncludeSameMembers(expected);
      });
    });

    describe('#setLimit', () => {
      it('should not throw', () => {
        (qb as any).setLimit();
        expect(qb.queryObject.per_page).toBeUndefined();
      });
      it('should throw an error', () => {
        expect((qb.setLimit as any).bind(qb, {})).toThrowError(RequestQueryException);
      });
      it('should set limit', () => {
        const expected = 10;
        qb.setLimit(expected);
        expect(qb.queryObject.per_page).toBe(expected);
      });
    });

    describe('#setOffset', () => {
      it('should not throw', () => {
        (qb as any).setOffset();
        expect(qb.queryObject.offset).toBeUndefined();
      });
      it('should throw an error', () => {
        expect((qb.setOffset as any).bind(qb, {})).toThrowError(RequestQueryException);
      });
      it('should set offset', () => {
        const expected = 10;
        qb.setOffset(expected);
        expect(qb.queryObject.offset).toBe(expected);
      });
    });

    describe('#setPage', () => {
      it('should not throw', () => {
        (qb as any).setPage();
        expect(qb.queryObject.page).toBeUndefined();
      });
      it('should throw an error', () => {
        expect((qb.setPage as any).bind(qb, {})).toThrowError(RequestQueryException);
      });
      it('should set page', () => {
        const expected = 10;
        qb.setPage(expected);
        expect(qb.queryObject.page).toBe(expected);
      });
    });

    describe('#resetCache', () => {
      it('should set cache', () => {
        expect(qb.queryObject.cache).toBeUndefined();
        qb.resetCache();
        expect(qb.queryObject.cache).toBe(0);
      });
    });

    describe('#search', () => {
      it('should not throw', () => {
        (qb as any).search();
        expect(qb.queryObject.search).toBeUndefined();
      });
    });

    // describe('#query', () => {
    //   it('should return an empty string', () => {
    //     expect(qb.query()).toBe('');
    //   });
    //   it('should return query with overrided fields name', () => {
    //     RequestQueryBuilder.setOptions({ paramNamesMap: { fields: ['override'] } });
    //     const test = qb.select(['foo', 'bar']).query();
    //     const expected = 'override=foo,bar';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with filter conditions, 1', () => {
    //     const test = qb
    //       .setFilter({ field: 'foo', operator: 'eq', value: 'test' })
    //       .setFilter({ field: 'bar', operator: 'notnull' })
    //       .query();
    //     const expected = 'filter[]=foo||eq||test&filter[]=bar||notnull';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with filter conditions, 2', () => {
    //     const test = qb
    //       .setFilter({ field: 'foo', operator: 'eq', value: 'test' })
    //       .query();
    //     const expected = 'filter=foo||eq||test';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with or conditions', () => {
    //     const test = qb
    //       .setOr({ field: 'foo', operator: 'eq', value: 'test' })
    //       .setOr({ field: 'bar', operator: 'notnull' })
    //       .query();
    //     const expected = 'or[]=foo||eq||test&or[]=bar||notnull';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with join', () => {
    //     const test = qb
    //       .setJoin({ field: 'foo' })
    //       .setJoin({ field: 'bar', select: ['test', 'test1'] })
    //       .query();
    //     const expected = 'join[]=foo&join[]=bar||test,test1';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with sort', () => {
    //     const test = qb
    //       .sortBy({ field: 'foo', order: 'ASC' })
    //       .sortBy({ field: 'bar', order: 'DESC' })
    //       .query();
    //     const expected = 'sort[]=foo,ASC&sort[]=bar,DESC';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with limit', () => {
    //     const test = qb.setLimit(10).query();
    //     const expected = 'per_page=10';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with offset', () => {
    //     const test = qb.setOffset(10).query();
    //     const expected = 'offset=10';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with page', () => {
    //     const test = qb.setPage(10).query();
    //     const expected = 'page=10';
    //     expect(test).toBe(expected);
    //   });
    //   it('should return query with cache', () => {
    //     const test = qb.resetCache().query();
    //     const expected = 'cache=0';
    //     expect(test).toBe(expected);
    //   });
    // });

    // describe('#createFromParams', () => {
    //   it('should set _fields', () => {
    //     const expected: QueryFields = ['geee', 'vooo'];
    //     let qb = RequestQueryBuilder.create({
    //       fields: expected,
    //     });
    //     expect((qb as any)._fields).toMatchObject(expected);
    //   });
    //   it('should set _filter', () => {
    //     const expected: QueryFilter = { field: 'foo', operator: CondOperator.EQUALS };
    //     let qb = RequestQueryBuilder.create({
    //       filter: [expected],
    //     });
    //     expect((qb as any)._filter[0]).toMatchObject(expected);
    //   });
    //   it('should set _or', () => {
    //     const expected: QueryFilter = { field: 'foo', operator: 'eq' };
    //     let qb = RequestQueryBuilder.create({
    //       or: [expected],
    //     });
    //     expect((qb as any)._or[0]).toMatchObject(expected);
    //   });
    //   it('should set _join', () => {
    //     const expected: QueryJoin = { field: 'foo', select: ['bar'] };
    //     let qb = RequestQueryBuilder.create({
    //       join: [expected],
    //     });
    //     expect((qb as any)._join[0]).toMatchObject(expected);
    //   });
    //   it('should set _sort', () => {
    //     const expected: QuerySort = { field: 'foo', order: 'ASC' };
    //     let qb = RequestQueryBuilder.create({
    //       sort: [expected],
    //     });
    //     expect((qb as any)._sort[0]).toMatchObject(expected);
    //   });
    //   it('should set _limit', () => {
    //     const expected = 10;
    //     let qb = RequestQueryBuilder.create({
    //       limit: expected,
    //     });
    //     expect((qb as any)._limit).toBe(expected);
    //   });
    //   it('should set _offset', () => {
    //     const expected = 10;
    //     let qb = RequestQueryBuilder.create({
    //       offset: expected,
    //     });
    //     expect((qb as any)._offset).toBe(expected);
    //   });
    //   it('should set _page', () => {
    //     const expected = 10;
    //     let qb = RequestQueryBuilder.create({
    //       page: expected,
    //     });
    //     expect((qb as any)._page).toBe(expected);
    //   });
    //   it('should set _cache', () => {
    //     const expected = 0;
    //     let qb = RequestQueryBuilder.create({
    //       resetCache: true,
    //     });
    //     expect((qb as any)._cache).toBe(expected);
    //   });
    // });
  });
});

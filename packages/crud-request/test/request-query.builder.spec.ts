import 'jest-extended';
import { RequestQueryBuilder } from '../src/request-query.builder';
import { RequestQueryException } from '../src/exceptions/request-query.exception';

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
      it('should set filter, 3', () => {
        qb.setFilter([
          ['foo', 'eq', 'bar'],
          { field: 'baz', operator: 'ne', value: 'zoo' },
        ]);
        const expected = ['foo||eq||bar', 'baz||ne||zoo'];
        expect(qb.queryObject.filter).toIncludeSameMembers(expected);
      });
      it('should set filter, 4', () => {
        qb.setFilter([['foo', 'eq', 'bar'], ['baz', 'ne', 'zoo']]);
        const expected = ['foo||eq||bar', 'baz||ne||zoo'];
        expect(qb.queryObject.filter).toIncludeSameMembers(expected);
      });
      it('should set filter, 5', () => {
        qb.setFilter(['foo', 'eq', 'bar']);
        const expected = ['foo||eq||bar'];
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
      it('should set join, 3', () => {
        qb.setJoin(['foo']);
        const expected = ['foo'];
        expect(qb.queryObject.join).toIncludeSameMembers(expected);
      });
      it('should set join, 4', () => {
        qb.setJoin(['foo', ['a', 'b', 'c']]);
        const expected = ['foo||a,b,c'];
        expect(qb.queryObject.join).toIncludeSameMembers(expected);
      });
      it('should set join, 5', () => {
        qb.setJoin([{ field: 'baz' }, ['foo', ['a', 'b', 'c']]]);
        const expected = ['baz', 'foo||a,b,c'];
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
      it('should set sort, 3', () => {
        qb.sortBy(['foo', 'ASC']);
        const expected = ['foo,ASC'];
        expect(qb.queryObject.sort).toIncludeSameMembers(expected);
      });
      it('should set sort, 4', () => {
        qb.sortBy([['foo', 'ASC']]);
        const expected = ['foo,ASC'];
        expect(qb.queryObject.sort).toIncludeSameMembers(expected);
      });
      it('should set sort, 5', () => {
        qb.sortBy([{ field: 'bar', order: 'DESC' }, ['foo', 'ASC']]);
        const expected = ['bar,DESC', 'foo,ASC'];
        expect(qb.queryObject.sort).toIncludeSameMembers(expected);
      });
    });

    describe('#setLimit', () => {
      it('should not throw', () => {
        (qb as any).setLimit();
        expect(qb.queryObject.limit).toBeUndefined();
      });
      it('should throw an error', () => {
        expect((qb.setLimit as any).bind(qb, {})).toThrowError(RequestQueryException);
      });
      it('should set limit', () => {
        const expected = 10;
        qb.setLimit(expected);
        expect(qb.queryObject.limit).toBe(expected);
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

    describe('#cond', () => {
      it('should throw an error, 1', () => {
        expect(qb.cond as any).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        expect((qb.cond as any).bind(qb, {})).toThrowError(RequestQueryException);
      });
      it('should return a filter string from an object', () => {
        const test = qb.cond({ field: 'foo', operator: 'eq', value: 'bar' });
        const expected = 'foo||eq||bar';
        expect(test).toBe(expected);
      });
      it('should return a filter string from an array', () => {
        const test = qb.cond(['foo', 'eq', 'bar']);
        const expected = 'foo||eq||bar';
        expect(test).toBe(expected);
      });
    });

    describe('#query', () => {
      it('should return an empty string', () => {
        expect(qb.query()).toBe('');
      });
      it('should return query with overrided fields name', () => {
        RequestQueryBuilder.setOptions({ paramNamesMap: { fields: ['override'] } });
        qb.setParamNames();
        const test = qb.select(['foo', 'bar']).query();
        const test2 = qb.select(['foo', 'bar']).query(false);
        const expected = 'override=foo%2Cbar';
        const expected2 = 'override=foo,bar';
        expect(test).toBe(expected);
        expect(test2).toBe(expected2);
      });
      it('should return valid query string with filters', () => {
        const test = qb
          .select(['foo', 'bar'])
          .setFilter([
            { field: 'is', operator: 'notnull' },
            { field: 'foo', operator: 'lt', value: 10 },
          ])
          .query(false);
        const expected = 'fields=foo,bar&filter[0]=is||notnull&filter[1]=foo||lt||10';
        expect(test).toBe(expected);
      });
      it('should return a valid query string', () => {
        const test = qb
          .select(['foo', 'bar'])
          .setFilter(['is', 'notnull'])
          .setOr({ field: 'ok', operator: 'ne', value: false })
          .setJoin({ field: 'voo', select: ['h', 'data'] })
          .setLimit(1)
          .setOffset(2)
          .setPage(3)
          .sortBy({ field: 'foo', order: 'DESC' })
          .resetCache()
          .setIncludeDeleted(1)
          .query(false);
        const expected =
          'fields=foo,bar&filter[0]=is||notnull&or[0]=ok||ne||false&join[0]=voo||h,data&limit=1&offset=2&page=3&sort[0]=foo,DESC&cache=0&include_deleted=1';
        expect(test).toBe(expected);
      });
    });

    describe('#search', () => {
      it('should not throw, 1', () => {
        (qb as any).search();
        expect(qb.queryObject.search).toBeUndefined();
      });
      it('should not throw, 2', () => {
        (qb as any).search(false);
        expect(qb.queryObject.search).toBeUndefined();
      });
      it('should set search string, 1', () => {
        const test = qb.search({ $or: [{ id: 1 }, { name: 'foo' }] }).query(false);
        const expected = 's={"$or":[{"id":1},{"name":"foo"}]}';
        expect(test).toBe(expected);
      });
      it('should set search string, 2', () => {
        const test = qb.search({ $or: [{ id: 1 }, { name: 'foo' }] }).query();
        const expected =
          's=%7B%22%24or%22%3A%5B%7B%22id%22%3A1%7D%2C%7B%22name%22%3A%22foo%22%7D%5D%7D';
        expect(test).toBe(expected);
      });
    });

    describe('#createFromParams', () => {
      it('should return an empty query string', () => {
        const test = RequestQueryBuilder.create().query();
        expect(test).toBe('');
      });
      it('should return a valid query string, 1', () => {
        const test = RequestQueryBuilder.create({
          fields: ['foo', 'bar'],
          filter: ['is', 'notnull'],
          or: { field: 'ok', operator: 'ne', value: false },
          join: { field: 'voo', select: ['h', 'data'] },
          limit: 1,
          offset: 2,
          page: 3,
          sort: [['foo', 'DESC']],
          resetCache: true,
        }).query(false);
        const expected =
          'fields=foo,bar&filter[0]=is||notnull&or[0]=ok||ne||false&join[0]=voo||h,data&limit=1&offset=2&page=3&sort[0]=foo,DESC&cache=0';
        expect(test).toBe(expected);
      });
      it('should return a valid query string, 2', () => {
        const test = RequestQueryBuilder.create({
          fields: ['foo', 'bar'],
        }).query(false);
        const expected = 'fields=foo,bar';
        expect(test).toBe(expected);
      });
    });
  });
});

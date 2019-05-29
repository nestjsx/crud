import { RequestQueryParser } from '../src/request-query.parser';
import { RequestQueryException } from '../src/exceptions/request-query.exception';
import { QueryFilter, QueryJoin, QuerySort } from '../src/types';

describe('#request-query', () => {
  describe('RequestQueryParser', () => {
    let qp: RequestQueryParser;

    beforeEach(() => {
      qp = new RequestQueryParser();
    });

    describe('#parse', () => {
      it('should return instance of RequestQueryParse', () => {
        expect((qp as any).parse()).toBeInstanceOf(RequestQueryParser);
        expect((qp as any).parse({})).toBeInstanceOf(RequestQueryParser);
      });

      describe('#parse fields', () => {
        it('should set empty array, 1', () => {
          const query = { select: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 1', () => {
          const query = { select: 'foo' };
          const expected = ['foo'];
          const test = qp.parse(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 2', () => {
          const query = { select: 'foo,bar' };
          const expected = ['foo', 'bar'];
          const test = qp.parse(query);
          expect(test.fields).toMatchObject(expected);
        });
      });

      describe('#parse filter', () => {
        it('should set empty array, 1', () => {
          const query = { filter: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.filter).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.filter).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { filter: 'foo||invalid||bar' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { filter: 'foo||eq' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array, 1', () => {
          const query = { filter: 'foo||eq||bar' };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'eq', value: 'bar' },
          ];
          const test = qp.parse(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { 'filter[]': ['foo||eq||bar', 'baz||ne||boo'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'eq', value: 'bar' },
            { field: 'baz', operator: 'ne', value: 'boo' },
          ];
          const test = qp.parse(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
          expect(test.filter[1]).toMatchObject(expected[1]);
        });
        it('should set array, 3', () => {
          const query = { 'filter[]': ['foo||in||1,2'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'in', value: [1, 2] },
          ];
          const test = qp.parse(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 4', () => {
          const query = { 'filter[]': ['foo||isnull'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'isnull', value: '' },
          ];
          const test = qp.parse(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 5', () => {
          const query = { 'filter[]': ['foo||eq||{"foo":true}'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'eq', value: '{"foo":true}' },
          ];
          const test = qp.parse(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
      });

      describe('#parse or', () => {
        it('should set empty array, 1', () => {
          const query = { or: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.or).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.or).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { or: 'foo||invalid||bar' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { or: 'foo||eq' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array, 1', () => {
          const query = { or: 'foo||eq||bar' };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'eq', value: 'bar' },
          ];
          const test = qp.parse(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { 'or[]': ['foo||eq||bar', 'baz||ne||boo'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'eq', value: 'bar' },
            { field: 'baz', operator: 'ne', value: 'boo' },
          ];
          const test = qp.parse(query);
          expect(test.or[0]).toMatchObject(expected[0]);
          expect(test.or[1]).toMatchObject(expected[1]);
        });
        it('should set array, 3', () => {
          const query = { 'or[]': ['foo||in||1,2'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'in', value: [1, 2] },
          ];
          const test = qp.parse(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
        it('should set array, 4', () => {
          const query = { 'or[]': ['foo||isnull'] };
          const expected: QueryFilter[] = [
            { field: 'foo', operator: 'isnull', value: '' },
          ];
          const test = qp.parse(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
      });

      describe('#parse join', () => {
        it('should set empty array, 1', () => {
          const query = { join: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.join).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.join).toMatchObject(expected);
        });
        it('should set array, 1', () => {
          const query = { join: 'foo' };
          const expected: QueryJoin[] = [{ field: 'foo' }];
          const test = qp.parse(query);
          expect(test.join[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { 'join[]': ['foo', 'bar||baz,boo'] };
          const expected: QueryJoin[] = [
            { field: 'foo' },
            { field: 'bar', select: ['baz', 'boo'] },
          ];
          const test = qp.parse(query);
          expect(test.join[0]).toMatchObject(expected[0]);
          expect(test.join[1]).toMatchObject(expected[1]);
        });
      });

      describe('#parse sort', () => {
        it('should set empty array, 1', () => {
          const query = { sort: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.sort).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parse(query);
          expect(test.sort).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { sort: 'foo' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { sort: 'foo,boo' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array', () => {
          const query = { 'sort[]': ['foo,ASC', 'bar,DESC'] };
          const expected: QuerySort[] = [
            { field: 'foo', order: 'ASC' },
            { field: 'bar', order: 'DESC' },
          ];
          const test = qp.parse(query);
          expect(test.sort[0]).toMatchObject(expected[0]);
          expect(test.sort[1]).toMatchObject(expected[1]);
        });
      });

      describe('#parse limit', () => {
        it('should set undefined, 1', () => {
          const query = { limit: '' };
          const test = qp.parse(query);
          expect(test.limit).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parse(query);
          expect(test.limit).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { limit: 'a' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { limit: '10' };
          const expected = 10;
          const test = qp.parse(query);
          expect(test.limit).toBe(expected);
        });
      });

      describe('#parse offset', () => {
        it('should set undefined, 1', () => {
          const query = { offset: '' };
          const test = qp.parse(query);
          expect(test.offset).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parse(query);
          expect(test.offset).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { offset: 'a' };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { offset: '10' };
          const expected = 10;
          const test = qp.parse(query);
          expect(test.offset).toBe(expected);
        });
      });

      describe('#parse page', () => {
        it('should set undefined, 1', () => {
          const query = { page: '' };
          const test = qp.parse(query);
          expect(test.page).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parse(query);
          expect(test.page).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { page: ['a'] };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { page: ['10'] };
          const expected = 10;
          const test = qp.parse(query);
          expect(test.page).toBe(expected);
        });
      });

      describe('#parse cache', () => {
        it('should set undefined, 1', () => {
          const query = { cache: '' };
          const test = qp.parse(query);
          expect(test.cache).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parse(query);
          expect(test.cache).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { cache: ['a'] };
          expect(qp.parse.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { cache: ['10'] };
          const expected = 10;
          const test = qp.parse(query);
          expect(test.cache).toBe(expected);
        });
      });
    });
  });
});

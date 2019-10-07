import 'jest-extended';
import { RequestQueryException } from '../src/exceptions/request-query.exception';
import { ParamsOptions, ParsedRequestParams } from '../src/interfaces';
import { RequestQueryParser } from '../src/request-query.parser';
import { FieldDescription, QueryFilter, QueryJoin, QuerySort } from '../src/types';

describe('#request-query', () => {
  describe('RequestQueryParser', () => {
    let qp: RequestQueryParser;

    beforeEach(() => {
      qp = RequestQueryParser.create();
    });

    describe('#parseQury', () => {
      it('should return instance of RequestQueryParse', () => {
        expect((qp as any).parseQuery()).toBeInstanceOf(RequestQueryParser);
        expect((qp as any).parseQuery({})).toBeInstanceOf(RequestQueryParser);
      });

      describe('#parse fields', () => {
        it('should set empty array, 1', () => {
          const query = { select: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 1', () => {
          const query = { select: 'foo' };
          const expected = ['foo'];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 2', () => {
          const query = { select: 'foo,bar' };
          const expected = ['foo', 'bar'];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 3', () => {
          const query = { select: 'foo::count' };
          const expected = [{ name: 'foo', aggregation: 'count' }];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 4', () => {
          const query = { select: 'foo:bar:' };
          const expected = [{ name: 'foo', alias: 'bar' }];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should set array, 5', () => {
          const query = { select: 'foo,bar:baz:count,boo' };
          const expected = [
            'foo',
            { name: 'bar', alias: 'baz', aggregation: 'count' },
            'boo',
          ];
          const test = qp.parseQuery(query);
          expect(test.fields).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { select: ':bar:count' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { select: 'foo:bar:baz' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
      });

      describe('#parse filter', () => {
        it('should set empty array, 1', () => {
          const query = { filter: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.filter).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.filter).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { filter: 'foo||invalid||bar' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { filter: 'foo||eq' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array, 1', () => {
          const query = { filter: 'foo||eq||bar' };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 'bar' },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { filter: ['foo||eq||bar', 'baz||ne||boo'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 'bar' },
            { field: 'baz', operator: 'ne', value: 'boo' },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
          expect(test.filter[1]).toMatchObject(expected[1]);
        });
        it('should set array, 3', () => {
          const query = { filter: ['foo||in||1,2'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'in', value: [1, 2] },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 4', () => {
          const query = { filter: ['foo||isnull'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'isnull', value: '' },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 5', () => {
          const query = { filter: ['foo||eq||{"foo":true}'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: '{"foo":true}' },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set array, 6', () => {
          const query = { filter: ['foo||eq||1'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 1 },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set date, 7', () => {
          const now = new Date();
          const query = { filter: [`foo||eq||${now.toJSON()}`] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: now },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set false, 8', () => {
          const query = { filter: [`foo||eq||false`] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: false },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set true, 9', () => {
          const query = { filter: [`foo||eq||true`] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: true },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set number, 10', () => {
          const query = { filter: [`foo||eq||12345`] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 12345 },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
        it('should set string, 11', () => {
          const query = { filter: ['foo||eq||4202140192612927005304000000236630'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: '4202140192612927005304000000236630' },
          ];
          const test = qp.parseQuery(query);
          expect(test.filter[0]).toMatchObject(expected[0]);
        });
      });

      describe('#parse or', () => {
        it('should set empty array, 1', () => {
          const query = { or: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.or).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.or).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { or: 'foo||invalid||bar' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { or: 'foo||eq' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array, 1', () => {
          const query = { or: 'foo||eq||bar' };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 'bar' },
          ];
          const test = qp.parseQuery(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { or: ['foo||eq||bar', 'baz||ne||boo'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'eq', value: 'bar' },
            { field: 'baz', operator: 'ne', value: 'boo' },
          ];
          const test = qp.parseQuery(query);
          expect(test.or[0]).toMatchObject(expected[0]);
          expect(test.or[1]).toMatchObject(expected[1]);
        });
        it('should set array, 3', () => {
          const query = { or: ['foo||in||1,2'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'in', value: [1, 2] },
          ];
          const test = qp.parseQuery(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
        it('should set array, 4', () => {
          const query = { or: ['foo||isnull'] };
          const expected: Array<QueryFilter<string | FieldDescription>> = [
            { field: 'foo', operator: 'isnull', value: '' },
          ];
          const test = qp.parseQuery(query);
          expect(test.or[0]).toMatchObject(expected[0]);
        });
      });

      describe('#parse join', () => {
        it('should set empty array, 1', () => {
          const query = { join: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.join).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.join).toMatchObject(expected);
        });
        it('should set array, 1', () => {
          const query = { join: 'foo' };
          const expected: QueryJoin[] = [{ field: 'foo' }];
          const test = qp.parseQuery(query);
          expect(test.join[0]).toMatchObject(expected[0]);
        });
        it('should set array, 2', () => {
          const query = { join: ['foo', 'bar||baz,boo'] };
          const expected: QueryJoin[] = [
            { field: 'foo' },
            { field: 'bar', select: ['baz', 'boo'] },
          ];
          const test = qp.parseQuery(query);
          expect(test.join[0]).toMatchObject(expected[0]);
          expect(test.join[1]).toMatchObject(expected[1]);
        });
      });

      describe('#parse group', () => {
        it('should set empty array, 1', () => {
          const query = { group: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.group).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.group).toMatchObject(expected);
        });
        it('should set array, 1', () => {
          const query = { group: 'foo' };
          const expected = ['foo'];
          const test = qp.parseQuery(query);
          expect(test.group).toMatchObject(expected);
        });
        it('should set array, 2', () => {
          const query = { group: 'foo,bar' };
          const expected = ['foo', 'bar'];
          const test = qp.parseQuery(query);
          expect(test.group).toMatchObject(expected);
        });
      });

      describe('#parse sort', () => {
        it('should set empty array, 1', () => {
          const query = { sort: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.sort).toMatchObject(expected);
        });
        it('should set empty array, 2', () => {
          const query = { foo: '' };
          const expected = [];
          const test = qp.parseQuery(query);
          expect(test.sort).toMatchObject(expected);
        });
        it('should throw an error, 1', () => {
          const query = { sort: 'foo' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should throw an error, 2', () => {
          const query = { sort: 'foo,boo' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set array', () => {
          const query = { sort: ['foo,ASC', 'bar,DESC'] };
          const expected: QuerySort[] = [
            { field: 'foo', order: 'ASC' },
            { field: 'bar', order: 'DESC' },
          ];
          const test = qp.parseQuery(query);
          expect(test.sort[0]).toMatchObject(expected[0]);
          expect(test.sort[1]).toMatchObject(expected[1]);
        });
      });

      describe('#parse limit', () => {
        it('should set undefined, 1', () => {
          const query = { limit: '' };
          const test = qp.parseQuery(query);
          expect(test.limit).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parseQuery(query);
          expect(test.limit).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { limit: 'a' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { limit: '10' };
          const expected = 10;
          const test = qp.parseQuery(query);
          expect(test.limit).toBe(expected);
        });
      });

      describe('#parse offset', () => {
        it('should set undefined, 1', () => {
          const query = { offset: '' };
          const test = qp.parseQuery(query);
          expect(test.offset).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parseQuery(query);
          expect(test.offset).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { offset: 'a' };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { offset: '10' };
          const expected = 10;
          const test = qp.parseQuery(query);
          expect(test.offset).toBe(expected);
        });
      });

      describe('#parse page', () => {
        it('should set undefined, 1', () => {
          const query = { page: '' };
          const test = qp.parseQuery(query);
          expect(test.page).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parseQuery(query);
          expect(test.page).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { page: ['a'] };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { page: ['10'] };
          const expected = 10;
          const test = qp.parseQuery(query);
          expect(test.page).toBe(expected);
        });
      });

      describe('#parse cache', () => {
        it('should set undefined, 1', () => {
          const query = { cache: '' };
          const test = qp.parseQuery(query);
          expect(test.cache).toBeUndefined();
        });
        it('should set undefined, 2', () => {
          const query = { foo: '' };
          const test = qp.parseQuery(query);
          expect(test.cache).toBeUndefined();
        });
        it('should throw an error', () => {
          const query = { cache: ['a'] };
          expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
        });
        it('should set value', () => {
          const query = { cache: ['10'] };
          const expected = 10;
          const test = qp.parseQuery(query);
          expect(test.cache).toBe(expected);
        });
      });
    });

    describe('#parse raw', () => {
      it('should set undefined, 1', () => {
        const query = { raw: '' };
        const test = qp.parseQuery(query);
        expect(test.raw).toBeUndefined();
      });
      it('should set undefined, 2', () => {
        const query = { foo: '' };
        const test = qp.parseQuery(query);
        expect(test.raw).toBeUndefined();
      });
      it('should throw an error', () => {
        const query = { raw: 'foo' };
        expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
      });
      it('should set value', () => {
        const query = { raw: 'true' };
        const expected = true;
        const test = qp.parseQuery(query);
        expect(test.raw).toBe(expected);
      });
    });

    describe('#parse search', () => {
      it('should set undefined', () => {
        const query = { foo: '' };
        const test = qp.parseQuery(query);
        expect(test.search).toBeUndefined();
      });
      it('should throw an error, 1', () => {
        const query = { s: 'invalid' };
        expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
      });
      it('should throw an error, 2', () => {
        const query = { s: 'true' };
        expect(qp.parseQuery.bind(qp, query)).toThrowError(RequestQueryException);
      });
      it('should parse search', () => {
        const query = { s: '{"$or":[{"id":1},{"name":"foo"}]}' };
        const expected = { $or: [{ id: 1 }, { name: 'foo' }] };
        const test = qp.parseQuery(query);
        expect(test.search).toMatchObject(expected);
      });
    });

    describe('#parseParams', () => {
      it('should return instance of RequestQueryParse', () => {
        expect((qp as any).parseParams()).toBeInstanceOf(RequestQueryParser);
        expect((qp as any).parseParams({})).toBeInstanceOf(RequestQueryParser);
      });
      it('should throw an error, 1', () => {
        const params = { foo: 'bar' };
        const options = undefined;
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 2', () => {
        const params = { foo: 'bar' };
        const options = {};
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 3', () => {
        const params = { foo: 'bar' };
        const options = { foo: {} };
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 4', () => {
        const params = { foo: 'bar' };
        const options = { foo: { field: 'number' } };
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 5', () => {
        const params = { foo: 'bar' };
        const options = { foo: { field: 'foo', type: 'number' } };
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should throw an error, 6', () => {
        const params = { foo: 'bar' };
        const options = { foo: { field: 'foo', type: 'uuid' } };
        expect(qp.parseParams.bind(qp, params, options)).toThrowError(
          RequestQueryException,
        );
      });
      it('should set paramsFilter', () => {
        const params = {
          foo: 'cb1751fd-7fcf-4eb5-b38e-86428b1fd88d',
          bar: '1',
          buz: 'string',
          bigInt: '9007199254740999', // Bigger than Number.MAX_SAFE_INTEGER
        };
        const options: ParamsOptions = {
          foo: { field: 'foo', type: 'uuid' },
          bar: { field: 'bb', type: 'number' },
          buz: { field: 'buz', type: 'string' },
          bigInt: { field: 'bigInt', type: 'string' },
        };
        const test = qp.parseParams(params, options);
        const expected = [
          { field: 'foo', operator: 'eq', value: 'cb1751fd-7fcf-4eb5-b38e-86428b1fd88d' },
          { field: 'bb', operator: 'eq', value: 1 },
          { field: 'buz', operator: 'eq', value: 'string' },
          { field: 'bigInt', operator: 'eq', value: '9007199254740999' },
        ];
        expect(test.paramsFilter).toMatchObject(expected);
      });
    });

    describe('#getParsed', () => {
      it('should return parsed params', () => {
        const expected: ParsedRequestParams = {
          fields: [],
          paramsFilter: [],
          search: undefined,
          filter: [],
          or: [],
          group: [],
          join: [],
          sort: [],
          limit: undefined,
          offset: undefined,
          page: undefined,
          cache: undefined,
          raw: false,
        };
        const test = qp.getParsed();
        expect(test).toMatchObject(expected);
      });
    });
  });
});

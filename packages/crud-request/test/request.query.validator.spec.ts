import { validateUUID } from '../src/request-query.validator';

describe('#request-query', () => {
  describe('#validator', () => {
    describe('#validateUUID', () => {
      const uuid = 'cf0917fc-af7d-11e9-a2a3-2a2ae2dbcce4';
      const uuidV4 = '6650aad9-29bd-4601-b9b1-543a7a2d2d54';
      const invalid = 'invalid-uuid';

      it('should throw an error', () => {
        expect(validateUUID.bind(validateUUID, invalid)).toThrow();
      });
      it('should pass, 1', () => {
        expect(validateUUID(uuid, '')).toBeUndefined();
      });
      it('should pass, 2', () => {
        expect(validateUUID(uuidV4, '')).toBeUndefined();
      });
    });
  });
});

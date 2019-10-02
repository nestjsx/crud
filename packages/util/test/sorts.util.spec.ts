import { sortFieldPathsByDepth, sortJoinOptionsByDepth } from '../src';

const createQueryJoin = (path): { field: string } => ({
  field: path,
});

describe('#util', () => {
  describe('#sorts.util', () => {
    it('sortFieldPathsByDepth', () => {
      expect(
        sortFieldPathsByDepth([
          'category.children.children.image',
          'category.children.children',
          'category.children.image',
          'category.children',
          'category.image',
          'category',
        ]),
      ).toEqual([
        'category',
        'category.children',
        'category.image',
        'category.children.children',
        'category.children.image',
        'category.children.children.image',
      ]);
    });

    it('sortJoinOptionsByDepth', () => {
      const a = createQueryJoin('category.children.children.image');
      const b = createQueryJoin('category.children.children');
      const c = createQueryJoin('category.image');
      const d = createQueryJoin('category');
      expect(sortJoinOptionsByDepth([a, b, c, d])).toEqual([d, c, b, a]);
    });
  });
});

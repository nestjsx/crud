const getDotsCount = (path: string) => path.split('.').length - 1;

export const sortFieldPathsByDepth = (paths: string[]): string[] => {
  return paths.sort((a, b) => {
    return getDotsCount(a) - getDotsCount(b);
  });
};

export const sortJoinOptionsByDepth = (joins: { field: string }[]) => {
  return joins.sort((a, b) => {
    return getDotsCount(a.field) - getDotsCount(b.field);
  });
};

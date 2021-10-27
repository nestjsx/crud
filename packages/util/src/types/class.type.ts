export type ClassType<T> = {
  new (...args: any[]): T;
};

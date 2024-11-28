interface RetryOptions<E> {
  err?: E;
  retry?: number;
}

export async function withRetry<T extends any, E extends any>(
  promise: Promise<T>,
  options: RetryOptions<E> = { retry: 0 },
): Promise<[E | undefined, T | undefined]> {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (error) {
    if (options.retry) {
      (options as any).attempt = typeof (options as any).attempt === 'undefined' ? 0 : (options as any).attempt + 1;

      if ((options as any).attempt < options.retry) {
        return withRetry<T, E>(promise, options) as any;
      }
    }
    return [options.err ? options.err : error, undefined];
  }
}

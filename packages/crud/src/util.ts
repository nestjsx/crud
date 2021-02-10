export function safeRequire<T = any>(path: string, loader?: () => T): T | null {
  try {
    const pack = loader ? loader() : require(path);
    return pack;
  } catch (_) {
    /* istanbul ignore next */
    return null;
  }
}

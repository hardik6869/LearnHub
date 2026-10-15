// Copies only the listed keys that are present. Used to whitelist request bodies, so a client
// can never set fields such as `user`, `academy` or server-computed values on create/update.
const pick = <T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> => {
  const result: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (source[key] !== undefined) result[key] = source[key];
  }
  return result as Pick<T, K>;
};

export default pick;

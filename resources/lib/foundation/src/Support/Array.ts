export function groupBy<T extends Record<K, PropertyKey>, K extends keyof T>(array: T[], key: K): Record<T[K], T[]> {
  return array.reduce((result, item) => {
    const groupKey = item[key];

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);

    return result;
  }, {} as Record<T[K], T[]>);
}



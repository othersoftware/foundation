export function wrap<T>(item: T): T[] & any[] {
  return Array.isArray(item) ? item : [item];
}

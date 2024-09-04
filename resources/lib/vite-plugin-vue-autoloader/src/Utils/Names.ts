import { normalizePath } from 'vite';
import { parse, basename } from 'node:path';
import { toSnakeCase, toPascalCase } from './Strings';

export function asLaravel(path: string, absolute: string) {
  absolute = normalizePath(absolute);
  path = normalizePath(path);

  return absolute.replace(path, '').replace(/^\//, '').replace('.vue', '').split('/').map(toSnakeCase).join('.');
}

export function asComponent(path: string, absolute: string) {
  absolute = normalizePath(absolute);
  path = normalizePath(path);

  return absolute.replace(path, '').replace(/^\//, '').replace('.vue', '').split('/').map(toPascalCase).join('');
}

export function asGlobalComponent(absolute: string) {
  absolute = normalizePath(absolute);

  let base = basename(absolute);
  let parsed = parse(base);

  return toPascalCase(parsed.name);
}

import { normalizePath } from 'vite';
import { parse, basename } from 'node:path';
import { toPascalCase } from './Strings';

export function asLaravel(path: string, absolute: string, namespace: string | null | false | undefined = undefined) {
  absolute = normalizePath(absolute);
  path = normalizePath(path);

  let compiled = absolute.replace(path, '').replace(/^\//, '').replace('.vue', '').split('/').join('.');

  if (namespace) {
    return namespace + '::' + compiled;
  }

  return compiled;
}

export function asComponent(path: string, absolute: string, namespace: string | null | false | undefined = undefined) {
  absolute = normalizePath(absolute);
  path = normalizePath(path);

  let segments = absolute.replace(path, '').replace(/^\//, '').replace('.vue', '').split('/');

  if (namespace) {
    segments.unshift(namespace);
  }

  return segments.map(toPascalCase).join('');
}

export function asGlobalComponent(absolute: string, namespace: string | null | false | undefined = undefined) {
  absolute = normalizePath(absolute);

  let base = basename(absolute);
  let parsed = parse(base);
  let name = toPascalCase(parsed.name);

  if (namespace) {
    return toPascalCase(namespace) + name;
  }

  return name;
}

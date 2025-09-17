import { toRaw } from 'vue';
import { url } from './Url';

type Params = Record<string, any>;

export type Route = {
  uri: string;
  domain: string;
  params: string[];
  binding: Record<string, string>;
}

export function route(name: string, params: Params = {}, hash?: string) {
  return build(localizeName(name), params, hash);
}


function localizeName(name: string) {
  if (name.startsWith(APP_FALLBACK_LOCALE)) {
    return name.replace(`${APP_FALLBACK_LOCALE}.`, '');
  }

  if (APP_AVAILABLE_LOCALES.findIndex(lang => name.startsWith(lang)) >= 0) {
    return name;
  }

  if (!name.startsWith('web.')) {
    return name;
  }

  if (APP_LOCALE !== APP_FALLBACK_LOCALE) {
    return `${APP_LOCALE}.${name}`;
  }

  return name;
}


function build(name: string, params: Params, hash?: string) {
  const route = APP_ROUTES[name];

  if (!route) {
    throw new Error(`Undefined route: ${name}`);
  }

  const uri = replaceRouteParameters(route, params);

  const search = Object.keys(params).reduce((prev, key) => {
    if (!route.params.includes(key)) {
      prev[key] = toRaw(params[key]);
    }

    return prev;
  }, {} as Record<string, any>);

  return url(uri, search, hash, route.domain);
}


function replaceRouteParameters(route: Route, params: Params) {
  return route.params.reduce((uri, param) => {
    let binding = route.binding[param] || 'id';
    let value = toRaw(params[param]);

    if (typeof value === 'object') {
      value = value[binding];
    }

    if (!value) {
      if (!uri.match(new RegExp(`\{${param}\\?\}`))) {
        throw new Error(`Parameter ${param} is required for uri ${route.uri}.`);
      }
    }

    uri = uri.replace(new RegExp(`\{${param}\\??\}`), value ?? '');

    if (uri.endsWith('/')) {
      uri = uri.slice(0, -1);
    }

    return uri;
  }, route.uri);
}

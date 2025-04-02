import { type ResolvedConfig, normalizePath } from 'vite';
import { scan } from '../Utils/Scanner';
import { asGlobalComponent, asLaravel, asComponent } from '../Utils/Names';
import { resolve } from 'node:path';

export type ResolvedComponent = { global: string, name: string, laravel: string, path: string }
export type ComponentsMap = Map<string, ResolvedComponent>
export type ViewsCollection = { components: ComponentsMap, vendors: ComponentsMap }

type Local = string;
type Vendor = string | null | undefined;
type Namespace = string | null | false | undefined;
type Sources = Record<Local, Vendor> | Local[] | Local;

export function collect(config: ResolvedConfig, sources: Sources, namespace: Namespace = undefined): ViewsCollection {
  const vendors: ComponentsMap = new Map();
  const components: ComponentsMap = new Map();

  if (Array.isArray(sources)) {
    sources = Object.fromEntries(sources.map((s) => [s, undefined]));
  }

  if (typeof sources === 'string') {
    sources = { [sources]: undefined };
  }

  Object.entries(sources).forEach(([local, vendor]) => {
    if (vendor) {
      scanComponents(resolve(config.root, vendor), components, vendors, namespace);
    }

    scanComponents(resolve(config.root, local), components, undefined, namespace);
  });

  return { components, vendors };
}

function scanComponents(source: string, components: ComponentsMap, vendors: ComponentsMap | undefined = undefined, namespace: Namespace = undefined) {
  scan(source).forEach((path) => {
    let global = asGlobalComponent(path, namespace);
    let laravel = asLaravel(source, path, namespace);
    let name = asComponent(source, path, namespace);

    path = normalizePath(path);

    if (vendors) {
      vendors.set(name, { global, name, laravel, path });
    }

    components.set(name, { global, name, laravel, path });
  });
}

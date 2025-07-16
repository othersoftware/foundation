import * as path from 'node:path';
import type { ResolvedConfig } from 'vite';
import { collect } from './Collector.ts';
import type { Options } from '../Types/Options.ts';

let viewsMap: Map<string, Set<string>> = new Map;

function collectViewsSet(config: ResolvedConfig, options: Options) {
  let collection = collect(config, options.views, options.namespace);
  let namespace = options.namespace || 'default';
  let views = new Set() as Set<string>;

  viewsMap.set(namespace, views);

  collection.components.forEach(component => {
    views.add(component.path);
  });

  collection.vendors.forEach(component => {
    views.add(component.path);
  });
}

export function resetViewsSet(config: ResolvedConfig, options: Options) {
  collectViewsSet(config, options);
}

export function transformViewComponent(config: ResolvedConfig, options: Options, code: string, id: string) {
  if (!viewsMap.has(options.namespace || 'default')) {
    collectViewsSet(config, options);
  }

  const resolvedId = path.normalize(id);

  // Check if the file is one of views components and is a Vue component
  if (!id.endsWith('.vue') || !viewsMap.get(options.namespace || 'default')!.has(resolvedId)) {
    return { code, map: null };
  }

  // Check if the template exists and doesn't already contain RouterView
  // Add RouterView at the end of the template when necessary
  if (code.includes('<template>') && !code.includes('<RouterView') && !code.includes('<router-view')) {
    const templateEnd = code.lastIndexOf('</template>');
    const beforeTemplate = code.slice(0, templateEnd);
    const afterTemplate = code.slice(templateEnd);

    return { code: `${beforeTemplate}\n  <RouterView />\n${afterTemplate}`, map: null };
  }

  return { code, map: null };
}

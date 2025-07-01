import type { Plugin, ResolvedConfig } from 'vite';
import * as path from 'node:path';

interface Options {
  target?: string;
  exclude?: string[];
}

export default function router(options: Options = {}): Plugin {
  const {
    target = 'resources/views',
    exclude = [],
  } = options;

  let resolvedConfig: ResolvedConfig;

  return {
    name: 'vite-plugin-vue-router',
    enforce: 'pre',

    configResolved(config) {
      resolvedConfig = config;
    },

    async transform(code, id) {
      // Resolve the full target directory path
      const resolvedTarget = path.join(resolvedConfig.root, target);
      const resolvedId = path.normalize(id);

      // Check if the file is in the target directory and is a Vue component
      if (!resolvedId.startsWith(resolvedTarget) || !id.endsWith('.vue') || exclude.some(pattern => id.includes(pattern))) {
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
    },
  };
}

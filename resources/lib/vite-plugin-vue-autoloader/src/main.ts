import { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { provideVirtualComponentsModule } from './Modules/Components';
import { provideVirtualViewsModule } from './Modules/Views';
import { Options } from './Types/Options';


export default function autoloader(options: Options): Plugin {
  let config: ResolvedConfig;

  function refreshDeclarations(server: ViteDevServer) {
    provideVirtualComponentsModule(config, options, false);
    provideVirtualViewsModule(config, options, false);

    const components = server.moduleGraph.getModuleById('\0@app/components');
    const views = server.moduleGraph.getModuleById('\0@app/views');

    if (components) {
      server.reloadModule(components);
    }

    if (views) {
      server.reloadModule(views);
    }
  }

  return {
    name: 'vue-autoloader',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id === '@app/components') return '\0@app/components';
      if (id === '@app/views') return '\0@app/views';
    },

    load(id) {
      if (id === '\0@app/components') return provideVirtualComponentsModule(config, options);
      if (id === '\0@app/views') return provideVirtualViewsModule(config, options);
    },

    configureServer(server) {
      const handler = (path: string) => {
        if (path.endsWith('.vue')) {
          refreshDeclarations(server);
        }
      };

      server.watcher.on('add', handler);
      server.watcher.on('unlink', handler);
      server.watcher.on('addDir', handler);
      server.watcher.on('unlinkDir', handler);
    },
  };
}

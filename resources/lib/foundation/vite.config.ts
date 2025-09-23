import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      bundleTypes: true,
      tsconfigPath: './tsconfig.lib.json',
    }),
  ],
  build: {
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'OtherSoftwareFoundation',
      fileName: 'other-software-foundation',
    },
    rollupOptions: {
      external: [
        '@vue/server-renderer',
        'vue',
        'lodash.get',
        'lodash.set',
        'lodash.clonedeep',
        'lodash.merge',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          '@vue/server-renderer': 'VueServerRenderer',
          'lodash.get': 'LodashGet',
          'lodash.set': 'LodashSet',
          'lodash.clonedeep': 'LodashCloneDeep',
          'lodash.merge': 'LodashMerge',
        },
      },
    },
  },
});

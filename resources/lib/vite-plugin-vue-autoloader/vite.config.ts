import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  plugins: [
    dts({
      bundleTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'OtherSoftwareAutoloader',
      fileName: 'other-software-autoloader',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vite', /^node:.*$/],
    },
  },
});

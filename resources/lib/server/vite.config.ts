import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      bundleTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'OtherSoftwareServer',
      fileName: 'other-software-server',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['node:process', 'node:http'],
    },
  },
});

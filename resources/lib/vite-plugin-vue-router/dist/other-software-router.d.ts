import { Plugin } from 'vite';

declare interface Options {
    target?: string;
    exclude?: string[];
}

declare function router(options?: Options): Plugin;
export default router;

export { }

import { Plugin } from 'vite';

declare function autoloader(options: Options): Plugin;
export default autoloader;

declare type Options = {
    target: Record<string, string | null | undefined> | string;
    components: Record<string, string | null | undefined> | string[] | string;
    views: Record<string, string | null | undefined> | string[] | string;
};

export { }

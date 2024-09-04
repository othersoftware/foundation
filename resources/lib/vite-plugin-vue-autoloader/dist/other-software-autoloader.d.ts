import { Plugin } from 'vite';

declare function autoloader(options: Options): Plugin;
export default autoloader;

declare type Options = {
    target: Record<string, string | null | undefined>;
    components: Record<string, string | null | undefined>;
    views: Record<string, string | null | undefined>;
};

export { }

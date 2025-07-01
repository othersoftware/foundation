import { State } from '@othersoftware/foundation';

declare type AppCallback = (state: State) => Promise<string>;

export declare function startRenderingService(render: AppCallback, port?: number): void;

export { }

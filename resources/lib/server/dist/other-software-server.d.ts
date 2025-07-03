import { InitialState } from '@othersoftware/foundation';

declare type AppCallback = (state: InitialState) => Promise<string>;

export declare function startRenderingService(render: AppCallback, port?: number): void;

export { }

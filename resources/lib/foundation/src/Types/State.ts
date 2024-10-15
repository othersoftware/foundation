import type { StackedViewResolved } from './StackedView';
import type { CompleteResponse } from '../Http/Client/Response';

export interface State {
  location: string,
  signature: string,
  stack: StackedViewResolved,
}

export type StateManager = (fresh: CompleteResponse) => Promise<State>;

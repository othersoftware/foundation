import type { StackedViewResolved } from './StackedView';
import type { Response } from '../Http/Client/Response';

export interface State {
  location: string,
  signature: string,
  stack: StackedViewResolved,
}

export type StateManager = (fresh: Response) => Promise<State>;

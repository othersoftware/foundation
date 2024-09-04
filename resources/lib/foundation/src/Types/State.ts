import type { StackedView } from './StackedView';
import type { Response } from '../Http/Client/Response';

export interface State {
  location: string,
  signature: string,
  stack: StackedView,
}

export type StateManager = (fresh: Response) => Promise<State>;

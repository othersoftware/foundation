import type { StackedViewResolved } from './StackedView';
import type { CompleteResponse } from '../Http/Client/Response';
import type { ToastRegistry } from './Toast';

export interface State {
  location: string,
  signature: string,
  stack: StackedViewResolved,
}

export interface InitialState extends State {
  toasts: ToastRegistry,
}

export type StateManager = (fresh: CompleteResponse) => Promise<State>;

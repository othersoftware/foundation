import type { StackedViewResolved } from './StackedView';
import type { CompleteResponse } from '../Http/Client/Response';
import type { ToastRegistry } from './Toast';

export interface Abilities extends Record<string, Ability> {

}

export interface Ability {
  allowed: boolean;
  denied: boolean;
  message: string | null;
  code: any;
}

export interface Authenticated {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shared {
  // Use module augmentation to type the shared state.
}

export type SharedState = Partial<Shared>;

export type Meta = {
  type: 'title',
  content: string;
} | {
  type: 'meta',
  name: string;
  content: string;
} | {
  type: 'link',
  rel: string;
  href: string;
} | {
  type: 'snippet',
  content: string;
};

export interface State {
  location: string,
  signature: string,
  stack: StackedViewResolved,
  meta?: Meta[],
}

export interface InitialState extends State {
  abilities: Abilities,
  authenticated: Authenticated | null,
  shared: SharedState,
  toasts: ToastRegistry,
}

export type StateManager = (fresh: CompleteResponse) => Promise<State>;

export type StateHistory = {
  historyPushState(state: State): void;
  historyReplaceState(state: State): void;
}

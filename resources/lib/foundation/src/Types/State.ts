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

export interface State {
  location: string,
  signature: string,
  stack: StackedViewResolved,
}

export interface InitialState extends State {
  abilities: Abilities,
  authenticated: Authenticated | null,
  toasts: ToastRegistry,
}

export type StateManager = (fresh: CompleteResponse) => Promise<State>;

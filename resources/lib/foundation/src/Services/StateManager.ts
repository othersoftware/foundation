import { type InjectionKey, inject, type Ref } from 'vue';
import type { StateManager, Authenticated, Abilities, StateHistory, ViewErrorsBag, Shared } from '../Types/State';
import type { StackedView, StackedViewResolved } from '../Types/StackedView';

export const StateLocationInjectionKey = Symbol('StateLocation') as InjectionKey<Ref<string>>;
export const StateStackSignatureInjectionKey = Symbol('StateStackSignature') as InjectionKey<Ref<string>>;
export const StateShared = Symbol('StateShared') as InjectionKey<Ref<Shared>>;
export const StateAuthenticated = Symbol('StateAuthenticated') as InjectionKey<Ref<Authenticated | null>>;
export const StateAbilities = Symbol('StateAbilities') as InjectionKey<Ref<Abilities>>;
export const StateManagerInjectionKey = Symbol('StateManager') as InjectionKey<StateManager>;
export const StateHistoryInjectionKey = Symbol('StateHistory') as InjectionKey<StateHistory>;
export const StateErrorsInjectionKey = Symbol('StateErrors') as InjectionKey<Ref<ViewErrorsBag>>;

export function useAbilities() {
  let abilities = inject(StateAbilities);

  if (!abilities) {
    throw new Error('Abilities are used out of router context!');
  }

  return abilities;
}

export function useAuthenticated() {
  let authenticated = inject(StateAuthenticated);

  if (!authenticated) {
    throw new Error('Authenticated is used out of router context!');
  }

  return authenticated;
}

export function useShared() {
  let shared = inject(StateShared);

  if (!shared) {
    throw new Error('Shared state is used out of router context!');
  }

  return shared;
}

export function useLocation() {
  let location = inject(StateLocationInjectionKey);

  if (!location) {
    throw new Error('Location is used out of router context!');
  }

  return location;
}

export function useStackSignature() {
  let signature = inject(StateStackSignatureInjectionKey);

  if (!signature) {
    throw new Error('Stack signature is used out of router context!');
  }

  return signature;
}

export function useStateManager() {
  let manager = inject(StateManagerInjectionKey);

  if (!manager) {
    throw new Error('State manager is used out of router context!');
  }

  return { update: manager };
}

export function useStateHistory() {
  let history = inject(StateHistoryInjectionKey);

  if (!history) {
    throw new Error('State history is used out of router context!');
  }

  return history;
}

export function useErrors() {
  let errors = inject(StateErrorsInjectionKey);

  if (!errors) {
    throw new Error('State errors is used out of router context!');
  }

  return errors;
}

export function updateStack(current: StackedViewResolved, fresh: StackedView): StackedViewResolved {
  if ('keep' in fresh) {
    if (fresh.child) {
      if (current.child) {
        current.child = updateStack(current.child, fresh.child);
      } else {
        current.child = fresh.child as StackedViewResolved;
      }

      return { ...current };
    }

    return { ...current };
  }

  return { ...fresh };
}

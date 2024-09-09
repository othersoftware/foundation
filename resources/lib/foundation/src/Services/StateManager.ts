import { type InjectionKey, inject, type Ref } from 'vue';
import type { StateManager } from '../Types/State';
import type { StackedView, StackedViewResolved } from '../Types/StackedView';

export const StateLocationInjectionKey = Symbol('StateLocation') as InjectionKey<Ref<string>>;
export const StateStackSignatureInjectionKey = Symbol('StateStackSignature') as InjectionKey<Ref<string>>;
export const StateManagerInjectionKey = Symbol('StateManager') as InjectionKey<StateManager>;

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

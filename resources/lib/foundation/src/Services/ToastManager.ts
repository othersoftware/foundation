import { type InjectionKey, inject, type Ref } from 'vue';
import type { ToastRegistry } from '../Types/Toast';

export const ToastRegistryInjectionKey = Symbol('ToastRegistry') as InjectionKey<Ref<ToastRegistry>>;

export function useToasts() {
  let toasts = inject(ToastRegistryInjectionKey);

  if (!toasts) {
    throw new Error('Toasts are used out of router context!');
  }

  return toasts;
}

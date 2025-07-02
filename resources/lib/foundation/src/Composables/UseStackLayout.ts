import { inject, type InjectionKey, type ConcreteComponent } from 'vue';

export const StackedViewLayoutInjectionKey = Symbol('StackedViewLayoutInjectionKey') as InjectionKey<ConcreteComponent | string | undefined>;

export function useStackLayout(): ConcreteComponent | string | undefined {
  return inject(StackedViewLayoutInjectionKey, () => undefined);
}

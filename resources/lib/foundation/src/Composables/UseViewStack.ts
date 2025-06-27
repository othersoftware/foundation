import { inject, type Ref, type InjectionKey } from 'vue';
import { StackedViewInjectionKey } from '../Services/StackedView';
import { type StackedViewResolved } from '../Types/StackedView';

export const PreventNestedRouterViewRenderInjectionKey = Symbol('PreventNestedRouterViewRenderInjectionKey') as InjectionKey<boolean>;

export function isNestedRouterViewPrevented(): boolean {
  return inject(PreventNestedRouterViewRenderInjectionKey, false);
}

export function useViewStack(): Ref<StackedViewResolved | undefined> {
  const view = inject(StackedViewInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get stacked view out of Router context!');
  }

  return view;
}

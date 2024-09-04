import { inject, type Ref } from 'vue';
import { StackedViewInjectionKey } from '../Services/StackedView';
import { type StackedView } from '../Types/StackedView';

export function useViewStack(): Ref<StackedView | undefined> {
  const view = inject(StackedViewInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get stacked view out of Router context!');
  }

  return view;
}

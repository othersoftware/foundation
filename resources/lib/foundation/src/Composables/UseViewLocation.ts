import { inject, type Ref } from 'vue';
import { StackedViewLocationInjectionKey } from '../Services/StackedView';

export function useViewLocation(): Ref<string | undefined> {
  const view = inject(StackedViewLocationInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get stacked view parent out of Router context!');
  }

  return view;
}

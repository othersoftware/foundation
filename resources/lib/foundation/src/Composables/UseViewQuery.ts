import { inject, type Ref } from 'vue';
import { StackedViewQueryInjectionKey } from '../Services/StackedView';

export function useViewQuery(): Ref<Record<string, any> | undefined> {
  const view = inject(StackedViewQueryInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get stacked view query params out of Router context!');
  }

  return view;
}

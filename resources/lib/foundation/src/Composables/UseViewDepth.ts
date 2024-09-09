import { inject, type Ref } from 'vue';
import { StackedViewDepthInjectionKey } from '../Services/StackedView';

export function useViewDepth(): Ref<number> {
  const view = inject(StackedViewDepthInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get view depth out of Router context!');
  }

  return view;
}

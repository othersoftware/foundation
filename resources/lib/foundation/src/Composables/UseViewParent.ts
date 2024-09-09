import { inject, type Ref, computed } from 'vue';
import { StackedViewParentInjectionKey } from '../Services/StackedView';
import type { StackedViewResolved } from '../Types/StackedView';
import { url } from '../Support/Url';

export function useViewParent(): Ref<StackedViewResolved | undefined> {
  const view = inject(StackedViewParentInjectionKey);

  if (!view) {
    throw new Error('You\'re trying to get parent view out of Router context!');
  }

  return view;
}

export function useViewParentLocation() {
  const parent = useViewParent();

  return computed(() => {
    if (parent && parent.value && parent.value.location) {
      return url(parent.value.location, parent.value.query);
    }
  });
}

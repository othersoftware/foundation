import { inject } from 'vue';
import { StackedViewResolverInjectionKey } from '../Services/StackedView';
import type { ViewResolver } from '../Types/ViewResolver';

export function useViewResolver(): ViewResolver {
  const resolver = inject(StackedViewResolverInjectionKey);

  if (!resolver) {
    throw new Error('You\'re trying to get ViewResolver ouf of Router context!');
  }

  return resolver;
}

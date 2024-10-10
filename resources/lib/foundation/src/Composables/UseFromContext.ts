import { inject } from 'vue';
import { FormContextInjectionKey, type FormContextInterface } from '../Services/FormContext';

export function useFromContext(): FormContextInterface | null {
  return inject(FormContextInjectionKey, null);
}

export function usePersistentFormContext(): FormContextInterface {
  let context = inject(FormContextInjectionKey);

  if (!context) {
    throw new Error('Accessing form outside of context.');
  }

  return context;
}

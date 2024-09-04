import { inject } from 'vue';
import { FormContextInjectionKey } from '../Services/FormContext';

export function useFromContext() {
  let context = inject(FormContextInjectionKey);

  if (!context) {
    throw new Error('Form context used out of scope!');
  }

  return context;
}

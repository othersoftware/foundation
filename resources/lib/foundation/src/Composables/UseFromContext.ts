import { inject } from 'vue';
import { FormContextInjectionKey } from '../Services/FormContext';

export function useFromContext() {
  return inject(FormContextInjectionKey, null);
}

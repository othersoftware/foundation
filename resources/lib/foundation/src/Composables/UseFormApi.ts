import { ref, type Ref } from 'vue';
import type { FormContextInterface } from '../Services/FormContext.ts';

type FormApi = {
  ctx: FormContextInterface;
  submit: () => void;
}

export function useFormApi() {
  return ref() as Ref<FormApi>;
}

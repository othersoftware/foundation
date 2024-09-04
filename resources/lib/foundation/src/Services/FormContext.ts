import { ref, type Ref, type InjectionKey } from 'vue';
import lodashSet from 'lodash.set';
import lodashGet from 'lodash.get';

export const FormContextInjectionKey = Symbol('FormContext') as InjectionKey<FormContextInterface>;

export function createFormContext(initial: Record<string, any> = {}) {
  const data = ref(initial) as Ref<Record<string, any>>;
  const errors = ref({}) as Ref<Record<string, string[]>>;
  const touched = ref({}) as Ref<Record<string, boolean>>;
  const processing = ref(false);

  function touch(name: string) {
    lodashSet(touched.value, name, true);
  }

  function value(name: string, value: any) {
    return lodashGet(data.value, name, value);
  }

  function fill(name: string, value: any) {
    lodashSet(data.value, name, value);
  }

  return {
    data,
    errors,
    touched,
    processing,
    touch,
    value,
    fill,
  };
}

export type FormContextInterface = ReturnType<typeof createFormContext>;

export function setModelWithContext(name: string | undefined, ctx: FormContextInterface | undefined, value: any) {
  if (name && ctx) {
    ctx.touch(name);
    ctx.fill(name, value);
  }

  return value;
}

export function getModelFromContext(name: string | undefined, ctx: FormContextInterface | undefined, value: any) {
  if (name && ctx) {
    return ctx.value(name, value);
  }

  return value;
}

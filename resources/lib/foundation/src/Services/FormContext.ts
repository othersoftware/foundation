import { ref, type Ref, type InjectionKey, computed, type MaybeRefOrGetter, toValue, watch } from 'vue';
import lodashCloneDeep from 'lodash.clonedeep';
import lodashSet from 'lodash.set';
import lodashGet from 'lodash.get';
import { useErrors } from './StateManager.ts';

export const FormContextInjectionKey = Symbol('FormContext') as InjectionKey<FormContextInterface>;

export function createFormContext(
  initialData: MaybeRefOrGetter<Record<string, any>>,
  initialBag: MaybeRefOrGetter<string>,
  initialReadonly: MaybeRefOrGetter<boolean>,
) {
  const bags = useErrors();

  const data = ref(lodashCloneDeep(toValue(initialData)));
  const readonly = ref(toValue(initialReadonly));
  const bag = ref(toValue(initialBag));

  const touched = ref({}) as Ref<Record<string, boolean>>;
  const processing = ref(false);

  const errors = computed(() => bags.value[bag.value] || {});

  function touch(name: string) {
    lodashSet(touched.value, name, true);
  }

  function value(name: string, value: any) {
    return lodashGet(data.value, name, value);
  }

  function fill(name: string, value: any) {
    lodashSet(data.value, name, value);
  }

  watch(() => toValue(initialData), (value) => data.value = lodashCloneDeep(value));
  watch(() => toValue(initialBag), (value) => bag.value = value);
  watch(() => toValue(initialReadonly), (value) => readonly.value = value);

  return {
    data,
    errors,
    touched,
    processing,
    readonly,
    touch,
    value,
    fill,
  };
}

export type FormContextInterface = ReturnType<typeof createFormContext>;

export function setModelWithContext(name: Nullable<string>, ctx: Nullable<FormContextInterface>, value: any) {
  if (name && ctx) {
    ctx.touch(name);
    ctx.fill(name, value);
  }

  return value;
}

export function getModelFromContext(name: Nullable<string>, ctx: Nullable<FormContextInterface>, value: any) {
  if (name && ctx) {
    return ctx.value(name, value);
  }

  return value;
}

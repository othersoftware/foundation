import { type PropType, ref, type Ref, nextTick, watch, provide, defineComponent, h, type SlotsType } from 'vue';
import type { Method } from '../../Http/Client/Request';
import type { Response } from '../../Http/Client/Response';
import { useHttpClient } from '../../Composables/UseHttpClient';
import { createFormContext, FormContextInjectionKey, type FormContextInterface } from '../../Services/FormContext';

type FormHandler = (data: any, ctx: FormContextInterface) => Promise<any>;

export const FormControllerComponent = defineComponent({
  name: 'FormController',
  props: {
    action: {
      type: String,
      required: false,
    },
    method: {
      type: String as PropType<Method>,
      required: false,
      default: 'POST',
    },
    data: {
      type: Object,
      required: false,
      default: {},
    },
    onSubmit: {
      type: Function as PropType<FormHandler>,
      required: false,
    },
  },
  slots: Object as SlotsType<{
    default: {
      data: any
      processing: boolean,
      errors: Record<string, string[]>,
      touched: Record<string, boolean>,
      ctx: FormContextInterface,
    },
  }>,
  setup(props, { slots, expose }) {
    const element = ref() as Ref<HTMLFormElement>;
    const ctx = createFormContext(props.data);
    const http = useHttpClient();

    const { data, processing, errors, touched } = ctx;

    function dispatch() {
      if (props.onSubmit) {
        return props.onSubmit(data.value, ctx);
      }

      if (!props.action) {
        throw new Error('You must either provide action or your custom form handler!');
      }

      return http.dispatch(props.method, props.action, { data: data.value });
    }

    function handleSubmit(event: Event) {
      event.preventDefault();
      event.stopPropagation();

      processing.value = true;
      errors.value = {};
      touched.value = {};

      // noinspection JSIgnoredPromiseFromCall
      nextTick(() => dispatch().catch((error: Response) => {
        if (error.status && error.status === 422 && error.errors) {
          errors.value = error.errors;
        }
      }).finally(() => {
        processing.value = false;
      }));
    }

    watch(() => props.data, (values) => {
      data.value = values;
    });

    expose({
      ctx,
      submit() {
        element.value.dispatchEvent(new SubmitEvent('submit'));
      },
    });

    provide(FormContextInjectionKey, ctx);

    return () => h('form', {
      ref: (el) => element.value = el as HTMLFormElement,
      action: props.action,
      method: props.method,
      onSubmit: handleSubmit,
    }, slots.default({
      data: data.value,
      processing: processing.value,
      errors: errors.value,
      touched: touched.value,
      ctx: ctx,
    }));
  },
});

import { type PropType, nextTick, provide, defineComponent, h, type SlotsType, inject, computed, mergeProps } from 'vue';
import type { Method } from '../../Http/Client/Request';
import type { Response } from '../../Http/Client/Response';
import { CompleteResponse } from '../../Http/Client/Response';
import { useHttpClient } from '../../Composables/UseHttpClient';
import { createFormContext, FormContextInjectionKey, type FormContextInterface } from '../../Services/FormContext';
import { useErrors } from '../../Services/StateManager.ts';
import { url } from '../../Support/Url.ts';

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
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    continuous: {
      type: Boolean,
      required: false,
      default: false,
    },
    bag: {
      type: String,
      required: false,
      default: 'default',
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
      submit: () => void,
    },
  }>,
  setup(props, { attrs, slots, expose }) {
    const parent = inject(FormContextInjectionKey, null);

    const ctx = createFormContext(() => props.data, () => props.bag, () => props.readonly);
    const http = useHttpClient();
    const bags = useErrors();

    const { data, processing, readonly, errors, touched } = ctx;

    const element = computed(() => {
      return parent ? 'div' : 'form';
    });

    const specific = computed(() => {
      return parent ? {
        ['data-action']: props.action,
        ['data-method']: props.method,
      } : {
        ['action']: props.action,
        ['method']: props.method,
      };
    });

    function dispatch() {
      if (props.onSubmit) {
        return props.onSubmit(data.value, ctx);
      }

      if (!props.action) {
        throw new Error('You must either provide action or your custom form handler!');
      }

      if (props.method === 'GET') {
        return http.dispatch(props.method, url(props.action, data.value));
      }

      return http.dispatch(props.method, props.action, { data: data.value });
    }

    function submit(event?: Event) {
      let beforeReadonly = readonly.value;

      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      processing.value = true;

      if (!props.continuous) {
        readonly.value = true;
      }

      bags.value = {};
      touched.value = {};

      // noinspection JSIgnoredPromiseFromCall
      nextTick(() => {
        dispatch().catch((error: Response | CompleteResponse) => {
          if (error instanceof CompleteResponse) {
            bags.value = error.errors;

            if (!props.continuous) {
              nextTick(() => {
                document.querySelector('.control--error')?.scrollIntoView();
              });
            }
          }
        }).finally(() => {
          processing.value = false;
          readonly.value = beforeReadonly;
        });
      });
    }

    function handleSubmit(event: Event) {
      event.stopPropagation();
      event.preventDefault();

      submit();
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;

        if (target.tagName !== 'TEXTAREA' && !(target as HTMLInputElement).form && element.value === 'div') {
          handleSubmit(event);
        }
      }
    }

    const eventHandlers = computed(() => {
      let handlers = {} as any;

      if (element.value === 'form') {
        handlers = { onSubmit: handleSubmit };
      } else if (element.value === 'div') {
        handlers = { onKeydown };
      }

      if (props.continuous) {
        handlers.onChange = handleSubmit;
      }

      return handlers;
    });

    expose({
      ctx,
      submit,
    });

    provide(FormContextInjectionKey, ctx);

    return () => h(element.value, mergeProps(attrs, specific.value, eventHandlers.value, { class: 'form' }), slots.default({
      data: data.value,
      processing: processing.value,
      errors: errors.value,
      touched: touched.value,
      ctx,
      submit,
    }));
  },
});

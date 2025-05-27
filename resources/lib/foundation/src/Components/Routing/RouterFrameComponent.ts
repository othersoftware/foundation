import { defineComponent, provide, h, ref, nextTick, toValue, toRaw, inject, type Ref, type SlotsType, onMounted, watch } from 'vue';
import { type StackedViewResolved } from '../../Types/StackedView';
import { updateStack, StateAuthenticated, StateAbilities } from '../../Services/StateManager';
import { ToastRegistryInjectionKey } from '../../Services/ToastManager';
import { HttpClientForceScrollPreservation } from '../../Composables/UseHttpClient';
import { Request } from '../../Http/Client/Request.ts';
import { EventBus } from '../../Events/EventBus.ts';
import { ErrorModal } from '../../Support/ErrorModal.ts';
import { useViewResolver } from '../../Composables/UseViewResolver.ts';
import { StackedViewInjectionKey } from '../../Services/StackedView.ts';


export const RouterFrameComponent = defineComponent({
    inheritAttrs: false,
    name: 'RouterFrame',
    props: {
      src: { type: String, required: true },
    },
    slots: Object as SlotsType<{
      default?: () => any,
    }>,
    setup(props, { slots }) {
      const resolver = useViewResolver();

      const abilities = inject(StateAbilities)!;
      const authenticated = inject(StateAuthenticated)!;
      const toasts = inject(ToastRegistryInjectionKey)!;
      const stack = inject(StackedViewInjectionKey)!;

      const loading = ref(true);
      const view = ref(undefined) as unknown as Ref<StackedViewResolved>;

      provide(HttpClientForceScrollPreservation, true);

      function load() {
        Request.send('GET', props.src).then(async (response) => {
          if (response.redirect) {
            return new Promise(() => {
              window.location.href = response.redirect.target;
            });
          }

          abilities.value = { ...abilities.value, ...response.abilities };
          authenticated.value = response.authenticated;

          if (response.stack) {
            view.value = updateStack(toRaw(toValue(view.value)), response.stack);
          }

          if (response.toasts && response.toasts.length > 0) {
            toasts.value = [...toasts.value, ...response.toasts];
          }

          await nextTick();

          return Promise.resolve(response);
        }).catch(async (error) => {
          if (error.status === 423) {
            EventBus.dispatch('password.confirm', { method: 'GET', url: props.src, options: { data: undefined, preserveScroll: true, replace: false } });

            return Promise.reject(error);
          }

          console.error(error);

          if (APP_DEBUG && error.content) {
            ErrorModal.show(error.content);
          }

          return Promise.reject(error);
        }).finally(() => {
          loading.value = false;
        });
      }

      onMounted(() => {
        load();
      });

      watch(stack, () => {
        load();
      });

      return () => {
        if (view.value && 'component' in view.value) {
          let component = resolver(view.value.component);
          let viewProps = view.value.props;

          component.inheritAttrs = !!component.inheritAttrs;

          return h(component, viewProps);
        }

        if (slots.default) {
          return slots.default();
        }
      };
    },
  })
;

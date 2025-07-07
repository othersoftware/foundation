import { defineComponent, provide, h, ref, nextTick, toValue, toRaw, computed, inject, type Ref, type SlotsType } from 'vue';
import { type State, type Abilities } from '../../Types/State';
import { type StackedViewResolved } from '../../Types/StackedView';
import { type CompleteResponse } from '../../Http/Client/Response';
import { StackedViewInjectionKey, StackedViewDepthInjectionKey } from '../../Services/StackedView';
import { StateLocationInjectionKey, StateManagerInjectionKey, StateStackSignatureInjectionKey, updateStack, StateAuthenticated, StateAbilities, StateHistoryInjectionKey, StateShared } from '../../Services/StateManager';
import { ToastRegistryInjectionKey } from '../../Services/ToastManager';
import { HttpClientForceScrollPreservation } from '../../Composables/UseHttpClient';
import { RouterNestedViewComponent } from './RouterNestedViewComponent';


export const RouterNestedComponent = defineComponent({
  inheritAttrs: false,
  name: 'RouterNested',
  props: {
    action: { type: String, required: true },
  },
  slots: Object as SlotsType<{
    default?: () => any,
  }>,
  setup(props, { slots }) {
    const location = ref(props.action);
    const abilities = ref(undefined) as unknown as Ref<Abilities>;
    const stack = ref(undefined) as unknown as Ref<StackedViewResolved>;
    const signature = ref(undefined) as unknown as Ref<string>;

    const shared = inject(StateShared)!;
    const authenticated = inject(StateAuthenticated)!;
    const toasts = inject(ToastRegistryInjectionKey)!;

    function buildState() {
      return {
        location: toRaw(toValue(location)),
        signature: toRaw(toValue(signature)),
        stack: toRaw(toValue(stack)),
      };
    }

    async function update(fresh: CompleteResponse): Promise<State> {
      abilities.value = { ...abilities.value, ...fresh.abilities };
      authenticated.value = fresh.authenticated;

      if (fresh.shared) {
        shared.value = { ...shared.value, ...fresh.shared };
      }

      if (fresh.location) {
        location.value = fresh.location;
      }

      if (fresh.signature) {
        signature.value = fresh.signature;
      }

      if (fresh.stack) {
        stack.value = updateStack(toRaw(toValue(stack.value)), fresh.stack);
      }

      if (fresh.toasts && fresh.toasts.length > 0) {
        toasts.value = [...toasts.value, ...fresh.toasts];
      }

      return await nextTick(() => buildState());
    }

    provide(StateAbilities, abilities);
    provide(StateShared, shared);
    provide(StateAuthenticated, authenticated);
    provide(StateLocationInjectionKey, location);
    provide(StateStackSignatureInjectionKey, signature);
    provide(StateManagerInjectionKey, update);
    provide(StackedViewDepthInjectionKey, computed(() => 0));
    provide(StackedViewInjectionKey, stack);
    provide(ToastRegistryInjectionKey, toasts);
    provide(HttpClientForceScrollPreservation, true);

    provide(StateHistoryInjectionKey, {
      historyPushState() {
        // Nothing to do, we don't handle history in nested routers.
      },
      historyReplaceState() {
        // Nothing to do, we don't handle history in nested routers.
      },
    });

    return () => {
      return h(RouterNestedViewComponent, { action: props.action }, slots);
    };
  },
});

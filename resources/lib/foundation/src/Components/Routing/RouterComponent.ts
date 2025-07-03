import { defineComponent, type PropType, provide, h, ref, nextTick, toValue, toRaw, onMounted, onBeforeUnmount, computed } from 'vue';
import { type ViewResolver } from '../../Types/ViewResolver';
import { type State, type InitialState } from '../../Types/State';
import type { CompleteResponse } from '../../Http/Client/Response';
import { StackedViewResolverInjectionKey, StackedViewInjectionKey, StackedViewDepthInjectionKey } from '../../Services/StackedView';
import { StateLocationInjectionKey, StateManagerInjectionKey, StateStackSignatureInjectionKey, updateStack, StateAuthenticated, StateAbilities, StateHistoryInjectionKey, StateShared } from '../../Services/StateManager';
import { RouterViewComponent } from './RouterViewComponent';
import { ToastRegistryInjectionKey } from '../../Services/ToastManager';
import { updateHead } from '../../Services/MetaManager.ts';


export const RouterComponent = defineComponent({
  inheritAttrs: false,
  name: 'Router',
  props: {
    resolver: {
      type: Function as PropType<ViewResolver>,
      required: true,
    },
    state: {
      type: Object as PropType<InitialState>,
      required: true,
    },
  },
  setup(props) {
    const abilities = ref(props.state.abilities);
    const meta = ref(props.state.meta);
    const shared = ref(props.state.shared || {});
    const authenticated = ref(props.state.authenticated);
    const location = ref(props.state.location);
    const stack = ref(props.state.stack);
    const signature = ref(props.state.signature);
    const toasts = ref(props.state.toasts);

    function buildState() {
      return {
        meta: toRaw(toValue(meta)),
        shared: toRaw(toValue(shared)),
        location: toRaw(toValue(location)),
        signature: toRaw(toValue(signature)),
        stack: toRaw(toValue(stack)),
      };
    }

    async function update(fresh: CompleteResponse): Promise<State> {
      abilities.value = { ...abilities.value, ...fresh.abilities };
      authenticated.value = fresh.authenticated;

      if (fresh.meta) {
        meta.value = updateHead(fresh.meta);
      }

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
    provide(StateAuthenticated, authenticated);
    provide(StateShared, shared);
    provide(StateLocationInjectionKey, location);
    provide(StateStackSignatureInjectionKey, signature);
    provide(StateManagerInjectionKey, update);
    provide(StackedViewResolverInjectionKey, props.resolver);
    provide(StackedViewDepthInjectionKey, computed(() => 0));
    provide(StackedViewInjectionKey, stack);
    provide(ToastRegistryInjectionKey, toasts);
    provide(StateHistoryInjectionKey, {
      historyPushState(state: State) {
        window.history.pushState(state, '', state.location);
      },
      historyReplaceState(state: State) {
        window.history.replaceState(state, '', state.location);
      },
    });

    function handlePopStateEvent(event: PopStateEvent) {
      if (event.state) {
        location.value = event.state.location;
        stack.value = event.state.stack;
        signature.value = event.state.signature;
      } else {
        window.history.replaceState(buildState(), '', location.value);
        window.scroll(0, 0);
      }
    }

    onMounted(() => {
      window.history.replaceState(buildState(), '', location.value);
      window.addEventListener('popstate', handlePopStateEvent);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopStateEvent);
    });

    return () => {
      return h(RouterViewComponent);
    };
  },
});

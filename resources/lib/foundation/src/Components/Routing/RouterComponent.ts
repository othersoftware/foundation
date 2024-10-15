import { defineComponent, type PropType, provide, h, ref, nextTick, toValue, toRaw, onMounted, onBeforeUnmount, computed } from 'vue';
import { type ViewResolver } from '../../Types/ViewResolver';
import { type State } from '../../Types/State';
import type { CompleteResponse } from '../../Http/Client/Response';
import { StackedViewResolverInjectionKey, StackedViewInjectionKey, StackedViewDepthInjectionKey } from '../../Services/StackedView';
import { StateLocationInjectionKey, StateManagerInjectionKey, StateStackSignatureInjectionKey, updateStack } from '../../Services/StateManager';
import { RouterViewComponent } from './RouterViewComponent';


export const RouterComponent = defineComponent({
  inheritAttrs: false,
  name: 'Router',
  props: {
    resolver: {
      type: Function as PropType<ViewResolver>,
      required: true,
    },
    state: {
      type: Object as PropType<State>,
      required: true,
    },
  },
  setup(props) {
    const location = ref(props.state.location);
    const stack = ref(props.state.stack);
    const signature = ref(props.state.signature);

    function buildState() {
      return {
        location: toRaw(toValue(location)),
        signature: toRaw(toValue(signature)),
        stack: toRaw(toValue(stack)),
      };
    }

    async function update(fresh: CompleteResponse): Promise<State> {
      location.value = fresh.location;
      signature.value = fresh.signature;

      if (fresh.stack) {
        stack.value = updateStack(toRaw(toValue(stack.value)), fresh.stack);
      }

      return await nextTick(() => buildState());
    }

    provide(StateLocationInjectionKey, location);
    provide(StateStackSignatureInjectionKey, signature);
    provide(StateManagerInjectionKey, update);
    provide(StackedViewResolverInjectionKey, props.resolver);
    provide(StackedViewDepthInjectionKey, computed(() => 0));
    provide(StackedViewInjectionKey, stack);

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
      return h(RouterViewComponent, { allowLayouts: true });
    };
  },
});

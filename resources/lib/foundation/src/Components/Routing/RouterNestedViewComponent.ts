import { defineComponent, type SlotsType, onMounted, ref, nextTick, h } from 'vue';
import { useHttpClient } from '../../Composables/UseHttpClient.ts';
import { RouterViewComponent } from './RouterViewComponent.ts';

export const RouterNestedViewComponent = defineComponent({
  inheritAttrs: false,
  name: 'RouterNestedView',
  props: {
    action: { type: String, required: true },
  },
  slots: Object as SlotsType<{
    default?: () => any,
  }>,
  setup(props, { slots }) {
    const http = useHttpClient();
    const loading = ref(true);

    onMounted(() => {
      http.dispatch('GET', props.action).then(() => nextTick(() => {
        loading.value = false;
      }));
    });

    return () => {
      if (loading.value) {
        if (slots.default) {
          return slots.default();
        }
      } else {
        return h(RouterViewComponent);
      }
    };
  },
});

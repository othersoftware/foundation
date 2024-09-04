import { defineComponent, provide, h, type PropType, computed } from 'vue';
import { StackedViewInjectionKey } from '../../Services/StackedView';
import { wrap } from '../../Support/Wrap';
import { useViewResolver } from '../../Composables/UseViewResolver';
import { useViewStack } from '../../Composables/UseViewStack';

export const RouterViewComponent = defineComponent({
  inheritAttrs: false,
  name: 'RouterView',
  props: {
    allowLayouts: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const resolver = useViewResolver();
    const view = useViewStack();

    const stack = computed(() => view.value?.child);

    provide(StackedViewInjectionKey, stack);

    return () => {
      if (view.value && 'component' in view.value) {
        let component = resolver(view.value.component);

        component.inheritAttrs = !!component.inheritAttrs;

        let children = h(component, view.value.props);

        if (props.allowLayouts && component.layout) {
          children = wrap(component.layout).concat(children).reverse().reduce((child, layout) => {
            layout = typeof layout === 'string' ? resolver(layout) : layout;

            layout.inheritAttrs = !!layout.inheritAttrs;

            return h(layout, null, () => child);
          });
        }

        return children;
      }
    };
  },
});

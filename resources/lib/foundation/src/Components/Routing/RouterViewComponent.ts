import { defineComponent, provide, h, type PropType, computed, type SlotsType } from 'vue';
import { StackedViewInjectionKey, StackedViewQueryInjectionKey, StackedViewLocationInjectionKey, StackedViewDepthInjectionKey, StackedViewParentInjectionKey } from '../../Services/StackedView';
import { wrap } from '../../Support/Wrap';
import { useViewResolver } from '../../Composables/UseViewResolver';
import { useViewStack } from '../../Composables/UseViewStack';
import { useViewDepth } from '../../Composables/UseViewDepth';
import type { StackedViewResolved } from '../../Types/StackedView';

export const RouterViewComponent = defineComponent({
  inheritAttrs: false,
  name: 'RouterView',
  props: {
    allowLayouts: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    },
  },
  slots: Object as SlotsType<{
    default?: () => any,
  }>,
  setup(props, { slots }) {
    const resolver = useViewResolver();
    const depth = useViewDepth();
    const view = useViewStack();

    const location = computed(() => view.value?.location);
    const query = computed(() => view.value?.query);

    const stack = computed(() => {
      if (view.value && view.value.child) {
        return { ...view.value.child, parent: view.value } satisfies StackedViewResolved;
      } else {
        return undefined;
      }
    });

    provide(StackedViewInjectionKey, stack);
    provide(StackedViewDepthInjectionKey, computed(() => depth.value + 1));
    provide(StackedViewParentInjectionKey, computed(() => view.value?.parent));
    provide(StackedViewLocationInjectionKey, location);
    provide(StackedViewQueryInjectionKey, query);

    return () => {
      if (view.value && 'component' in view.value) {
        let component = resolver(view.value.component);
        let viewProps = view.value.props;

        component.inheritAttrs = !!component.inheritAttrs;

        let children = h(component, viewProps);

        if (props.allowLayouts && component.layout) {
          children = wrap(component.layout).concat(children).reverse().reduce((child, layout) => {
            layout = typeof layout === 'string' ? resolver(layout) : layout;

            layout.inheritAttrs = !!layout.inheritAttrs;

            return h(layout, viewProps, () => child);
          });
        }

        return children;
      }

      if (slots.default) {
        return slots.default();
      }
    };
  },
});

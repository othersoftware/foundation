import { defineComponent, ref, computed, h, type PropType, nextTick, mergeProps } from 'vue';
import { type Body, type Method } from '../../Http/Client/Request';
import { useLocation } from '../../Services/StateManager';
import { useHttpClient } from '../../Composables/UseHttpClient';

export const RouterLinkComponent = defineComponent({
  name: 'RouterLink',
  props: {
    method: { type: String as PropType<Method>, required: false, default: 'GET' },
    href: { type: String as PropType<string | null | undefined>, required: false },
    data: { type: [Object, Array, String, null] as PropType<Body>, required: false },
    preserveScroll: { type: Boolean, required: false },
    replace: { type: Boolean, required: false },
    target: { type: String as PropType<string>, required: false },
    disabled: { type: Boolean, required: false },
    explicit: { type: Boolean, required: false },
  },
  setup(props, { attrs, slots }) {
    const location = useLocation();
    const http = useHttpClient();
    const pending = ref(false);

    const active = computed(() => {
      let current = location.value.replace(/\/$/, '');
      let target = props.href?.replace(/\/$/, '');
      let explicit = current === target;
      let implicit = (!props.explicit && target && location.value.startsWith(target));

      return explicit || implicit;
    });

    const as = computed(() => props.href ? 'a' : 'button');
    const specific = computed(() => props.href ? { target: props.target } : { disabled: props.disabled });

    function onClick(event: MouseEvent) {
      if (!props.href || !shouldInterceptEvent(event, props.href, props.target)) {
        return;
      }

      if (event.defaultPrevented) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (props.disabled) {
        return;
      }

      let { method, href, data, preserveScroll, replace } = props;

      pending.value = true;

      // noinspection JSIgnoredPromiseFromCall
      nextTick(() => {
        http.dispatch(method, href, { data, preserveScroll, replace }).then(() => {
          pending.value = false;
        }).catch(() => {
          pending.value = false;
        });
      });
    }

    return () => h(
      as.value,
      mergeProps(attrs, specific.value, {
        href: props.href,
        class: [{ active: active.value, pending: pending.value, disabled: props.disabled }],
        onClick,
      }),
      // @ts-ignore
      slots.default({ active, pending }),
    );
  },
});

function shouldInterceptEvent(event: MouseEvent, href: string, target?: string) {
  if (target === '_blank' || isCrossOriginHref(href)) {
    return false;
  }

  return !(
    event.button > 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function isCrossOriginHref(href: string) {
  try {
    let currentOrigin = window.location.host;
    let targetOrigin = new URL(href).host;

    return currentOrigin !== targetOrigin;
  } catch (e) {
    return false;
  }
}

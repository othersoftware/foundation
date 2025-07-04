import { defineComponent, type SlotsType, h, type PropType, onMounted, ref, onBeforeUnmount } from 'vue';
import type { ToastRegistry, Toast } from '../../Types/Toast';
import { useToasts } from '../../Services/ToastManager';

export const ToastControllerComponent = defineComponent({
  name: 'ToastController',

  slots: Object as SlotsType<{
    default: { toasts: ToastRegistry },
  }>,

  // _props is a hack to avoid TS error on unused parameter as it is not used
  // at the moment it will throw a TS error, but it has to be passed to read
  // slots and attrs. Remember _ in front whenever you will actually have to
  // use the props. https://github.com/microsoft/TypeScript/issues/9458
  setup(_props, { slots, attrs }) {
    const toasts = useToasts();

    return () => h('div', attrs, slots.default({ toasts: toasts.value }));
  },
});

export const ToastComponent = defineComponent({
  name: 'Toast',
  props: {
    toast: { type: Object as PropType<Toast>, required: true },
  },
  slots: Object as SlotsType<{
    default: { toast: Toast, close: () => void },
  }>,
  setup(props, { slots, attrs }) {
    const toasts = useToasts();
    const timeout = ref();

    function close() {
      clearTimeout(timeout.value);
      toasts.value = toasts.value.filter((toast) => toast.id !== props.toast.id);
    }

    onMounted(() => {
      timeout.value = setTimeout(() => close(), props.toast.duration * 1000);
    });

    onBeforeUnmount(() => {
      clearTimeout(timeout.value);
    });

    return () => h('li', attrs, slots.default({ toast: props.toast, close }));
  },
});

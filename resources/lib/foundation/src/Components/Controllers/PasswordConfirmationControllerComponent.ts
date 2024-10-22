import { defineComponent, type SlotsType, h, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { EventBus } from '../../Events/EventBus';
import { useHttpClient } from '../../Composables/UseHttpClient';

export const PasswordConfirmationControllerComponent = defineComponent({
  name: 'PasswordConfirmationController',
  props: {
    action: { type: String, required: true },
  },
  slots: Object as SlotsType<{
    default: { open: boolean, submit: (data: any) => void, cancel: () => void },
  }>,
  setup(props, { slots, attrs }) {
    const http = useHttpClient();
    const original = ref();
    const open = ref(false);

    function onPasswordConfirm(event: any) {
      original.value = event;
      open.value = true;
    }

    async function submit(data: any) {
      let { method, url, options } = original.value;

      return await http.post(props.action, data).then(async () => {
        return await http.dispatch(method, url, options).then(async (res) => {
          cancel();
          return await nextTick(() => res);
        });
      });
    }

    function cancel() {
      open.value = false;
      original.value = undefined;
    }

    onMounted(() => {
      EventBus.addEventListener('password.confirm', onPasswordConfirm);
    });

    onBeforeUnmount(() => {
      EventBus.removeEventListener('password.confirm', onPasswordConfirm);
    });

    return () => h('div', attrs, slots.default({ open: open.value, submit, cancel }));
  },
});

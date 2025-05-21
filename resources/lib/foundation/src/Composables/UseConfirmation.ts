import { ref, type Ref, nextTick } from 'vue';

interface Config {
  title?: string;
  description?: string;
  yes?: string;
  no?: string;
}

interface ConfigWithCallback<T> extends Config {
  callback: Callback<T>;
}

export interface Confirmation extends Config {
  processing: boolean,
  confirm: () => void;
  cancel: () => void;
}

type Callback<T> = () => Promise<T> | T;

const confirmation = ref() as Ref<Confirmation | undefined>;

async function createConfirmation<T>(config: Config, callback: Callback<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    function confirm() {
      confirmation.value!.processing = true;

      nextTick(() => {
        Promise.resolve(callback()).then((value: T) => {
          confirmation.value = undefined;
          nextTick(() => resolve(value));
        }).catch((error) => {
          confirmation.value = undefined;
          nextTick(() => reject(error));
        });
      });
    }

    function cancel() {
      confirmation.value = undefined;
      nextTick(() => reject());
    }

    confirmation.value = { ...config, processing: false, confirm, cancel };
  });
}

async function factory<T>(config: ConfigWithCallback<T>): Promise<T>;
async function factory<T>(callback: Callback<T>): Promise<T>;
async function factory<T>(config: Config, callback: Callback<T>): Promise<T>;
async function factory<T>(configOrCallback: any, callback?: Callback<T>): Promise<T> {
  if (callback === undefined) {
    if (configOrCallback instanceof Function) {
      return createConfirmation({}, configOrCallback);
    } else {
      return createConfirmation(configOrCallback, configOrCallback.callback);
    }
  } else {
    if (configOrCallback instanceof Function) {
      return createConfirmation({}, configOrCallback);
    } else {
      return createConfirmation(configOrCallback, callback);
    }
  }
}

export function useCurrentConfirmation() {
  return confirmation;
}

export function useConfirmation() {
  return factory;
}

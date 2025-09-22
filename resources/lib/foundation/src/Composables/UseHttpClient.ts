import { useStateManager, useStackSignature, useStateHistory, useLocation } from '../Services/StateManager';
import { Request, type Method, type Body, type RequestOptions } from '../Http/Client/Request';
import { ErrorModal } from '../Support/ErrorModal';
import type { Response } from '../Http/Client/Response';
import { CompleteResponse } from '../Http/Client/Response';
import { EventBus } from '../Events/EventBus';
import { inject, type InjectionKey } from 'vue';
import lodashMerge from 'lodash.merge';

interface HttpOptions extends Omit<RequestOptions, 'method' | 'url' | 'body' | 'signature' | 'referer'> {
  data?: Body | undefined;
  preserveScroll?: boolean | undefined;
  replace?: boolean | undefined;
}

export const HttpClientScrollHandler = Symbol('HttpClientScrollHandler') as InjectionKey<undefined | (() => void)>;
export const HttpClientForceScrollPreservation = Symbol('HttpClientForceScrollPreservation') as InjectionKey<boolean>;
export const HttpClientForceNested = Symbol('HttpClientForceNested') as InjectionKey<boolean>;

export function useHttpClient() {
  const state = useStateManager();
  const signature = useStackSignature();
  const history = useStateHistory();
  const location = useLocation();

  const scrollHandler = inject(HttpClientScrollHandler, () => document.body.scroll({ behavior: 'instant', left: 0, top: 0 }));
  const forceScrollPreserve = inject(HttpClientForceScrollPreservation, false);
  const forceNested = inject(HttpClientForceNested, false);

  async function dispatch(method: Method, url: string, { data = undefined, preserveScroll = false, replace = false, nested = false, ...options }: HttpOptions = {}, previous: CompleteResponse | undefined = undefined) {
    document.body.classList.add('osf-loading');
    document.dispatchEvent(new Event('visit:start'));

    return await Request.send({
      ...options,
      method,
      url,
      body: data,
      signature: signature.value,
      referer: location.value,
      nested: nested || forceNested,
    }).then(async (response: CompleteResponse) => {
      if (previous) {
        response.abilities = { ...previous.abilities, ...response.abilities };
        response.shared = { ...previous.shared, ...response.shared };
        response.toasts = lodashMerge(previous.toasts, response.toasts);
        response.errors = lodashMerge(previous.errors, response.errors);
      }

      if (response.redirect) {
        return await handleRedirectResponse(response);
      }

      return await state.update(response).then(async (fresh): Promise<any> => {
        if (response.raw) {
          return Promise.resolve(response.data);
        }

        if (!forceScrollPreserve && !preserveScroll) {
          resetScrollPosition();
        }

        if (replace) {
          history.historyReplaceState(fresh);
        } else {
          history.historyPushState(fresh);
        }

        return Promise.resolve(response);
      });
    }).catch(async (error: Response | CompleteResponse) => {
      if (error instanceof CompleteResponse) {
        return await state.update(error).then(() => Promise.reject(error));
      }

      if (error.status === 423) {
        EventBus.dispatch('password.confirm', { method, url, options: { data, preserveScroll, replace } });

        return Promise.reject(error);
      }

      console.error(error);

      if (APP_DEBUG && error.content) {
        ErrorModal.show(error.content);
      }

      return Promise.reject(error);
    }).finally(() => {
      document.body.classList.remove('osf-loading');
      document.dispatchEvent(new Event('visit:done'));
    });
  }

  function resetScrollPosition() {
    if (scrollHandler) {
      scrollHandler();
    }
  }

  async function handleRedirectResponse(response: CompleteResponse): Promise<any> {
    if (response.redirect.reload) {
      return await new Promise(() => {
        window.location.href = response.redirect.target;
      });
    }

    return await dispatch('GET', response.redirect.target, {
      preserveScroll: true,
      replace: false,
      refreshStack: true,
    }, response);
  }

  return {
    dispatch,

    get: async function (url: string) {
      return await dispatch('GET', url);
    },

    post: async function (url: string, data: Body | undefined = undefined) {
      return await dispatch('POST', url, { data, preserveScroll: true });
    },

    patch: async function (url: string, data: Body | undefined = undefined) {
      return await dispatch('PATCH', url, { data, preserveScroll: true });
    },

    put: async function (url: string, data: Body | undefined = undefined) {
      return await dispatch('PUT', url, { data, preserveScroll: true });
    },

    delete: async function (url: string, data: Body | undefined = undefined) {
      return await dispatch('DELETE', url, { data, preserveScroll: true });
    },
  };
}

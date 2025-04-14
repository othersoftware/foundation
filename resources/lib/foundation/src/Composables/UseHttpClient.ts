import { useStateManager, useStackSignature, useStateHistory, useLocation } from '../Services/StateManager';
import { Request, type Method, type Body } from '../Http/Client/Request';
import { ErrorModal } from '../Support/ErrorModal';
import type { RouterRedirect } from '../Types/RouterRedirect';
import type { Response } from '../Http/Client/Response';
import { CompleteResponse } from '../Http/Client/Response';
import { EventBus } from '../Events/EventBus';
import { inject, type InjectionKey } from 'vue';

interface HttpOptions {
  data?: Body | undefined,
  preserveScroll?: boolean,
  replace?: boolean,
  refreshStack?: boolean,
}

export const HttpClientForceScrollPreservation = Symbol('HttpClientForceScrollPreservation') as InjectionKey<boolean>;

export function useHttpClient() {
  const state = useStateManager();
  const signature = useStackSignature();
  const history = useStateHistory();
  const location = useLocation();

  const forceScrollPreserve = inject(HttpClientForceScrollPreservation, false);

  async function dispatch(method: Method, url: string, { data = undefined, preserveScroll = false, replace = false, refreshStack = false }: HttpOptions = {}) {
    document.body.classList.add('osf-loading');

    return await Request.send(method, url, data, signature.value, refreshStack, location.value).then(async (response: CompleteResponse) => {
      return await state.update(response).then((fresh) => {
        if (response.redirect) {
          return handleRedirectResponse(response.redirect);
        }

        if (response.raw) {
          return Promise.resolve(response.raw);
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
    });
  }

  function resetScrollPosition() {
    window.scroll(0, 0);
  }

  async function handleRedirectResponse(redirect: RouterRedirect) {
    if (redirect.reload) {
      return await new Promise(() => {
        window.location.href = redirect.target;
      });
    }

    return await dispatch('GET', redirect.target, {
      preserveScroll: true,
      replace: false,
      refreshStack: true,
    });
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

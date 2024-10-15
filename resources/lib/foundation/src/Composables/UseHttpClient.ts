import { useStateManager, useStackSignature } from '../Services/StateManager';
import { Request, type Method, type Body } from '../Http/Client/Request';
import type { State } from '../Types/State';
import { ErrorModal } from '../Support/ErrorModal';
import type { RouterRedirect } from '../Types/RouterRedirect';
import type { Response } from '../Http/Client/Response';
import { CompleteResponse } from '../Http/Client/Response';

interface HttpOptions {
  data?: Body | undefined,
  preserveScroll?: boolean,
  replace?: boolean,
}

export function useHttpClient() {
  const state = useStateManager();
  const signature = useStackSignature();

  async function dispatch(method: Method, url: string, { data = undefined, preserveScroll = false, replace = false }: HttpOptions = {}) {
    return await Request.send(method, url, data, signature.value).then(async (response: CompleteResponse) => {
      return await state.update(response).then((fresh) => {
        if (response.redirect) {
          return handleRedirectResponse(response.redirect);
        }

        if (response.raw) {
          return Promise.resolve(response.raw);
        }

        if (!preserveScroll) {
          resetScrollPosition();
        }

        if (replace) {
          historyReplaceState(fresh);
        } else {
          historyPushState(fresh);
        }

        return Promise.resolve(response);
      });
    }).catch(async (error: Response | CompleteResponse) => {
      if (error instanceof CompleteResponse) {
        return await state.update(error).then(() => Promise.reject(error));
      }

      console.error(error);

      if (APP_DEBUG && error.content) {
        ErrorModal.show(error.content);
      }

      return Promise.reject(error);
    });
  }

  function historyPushState(state: State) {
    window.history.pushState(state, '', state.location);
  }

  function historyReplaceState(state: State) {
    window.history.replaceState(state, '', state.location);
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

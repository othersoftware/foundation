(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue"), require("lodash.merge"), require("lodash.clonedeep"), require("lodash.set"), require("lodash.get"), require("@vue/server-renderer")) : typeof define === "function" && define.amd ? define(["exports", "vue", "lodash.merge", "lodash.clonedeep", "lodash.set", "lodash.get", "@vue/server-renderer"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.OtherSoftwareFoundation = {}, global.Vue, global.LodashMerge, global.LodashCloneDeep, global.LodashSet, global.LodashGet, global.VueServerRenderer));
})(this, function(exports2, vue, lodashMerge, lodashCloneDeep, lodashSet, lodashGet, serverRenderer) {
  "use strict";
  class Response {
    xhr;
    status;
    success;
    fail;
    partial;
    raw;
    message;
    content;
    constructor(xhr) {
      this.xhr = xhr;
      if (this.xhr.getResponseHeader("x-stack-router")) {
        throw new Error("Invalid response for MVC HTTP client.");
      }
      this.status = this.xhr.status;
      this.success = this.xhr.status >= 200 && this.xhr.status < 300;
      this.fail = !this.success;
      this.content = this.xhr.response;
      this.message = this.xhr.statusText;
      this.partial = !!this.xhr.getResponseHeader("x-partial");
      this.raw = !!this.xhr.getResponseHeader("x-raw");
    }
  }
  class CompleteResponse extends Response {
    abilities;
    meta;
    shared;
    authenticated;
    location;
    signature;
    redirect;
    stack;
    toasts;
    errors;
    data;
    constructor(xhr) {
      super(xhr);
      let data = JSON.parse(this.xhr.response);
      this.meta = data.meta;
      this.abilities = data.abilities;
      this.shared = data.shared;
      this.authenticated = data.authenticated;
      this.location = data.location;
      this.signature = data.signature;
      this.redirect = data.redirect;
      this.stack = data.stack;
      this.errors = data.errors;
      this.toasts = data.toasts;
      this.data = data.raw;
    }
  }
  const StateLocationInjectionKey = Symbol("StateLocation");
  const StateStackSignatureInjectionKey = Symbol("StateStackSignature");
  const StateShared = Symbol("StateShared");
  const StateAuthenticated = Symbol("StateAuthenticated");
  const StateAbilities = Symbol("StateAbilities");
  const StateManagerInjectionKey = Symbol("StateManager");
  const StateHistoryInjectionKey = Symbol("StateHistory");
  const StateErrorsInjectionKey = Symbol("StateErrors");
  function useAbilities() {
    let abilities = vue.inject(StateAbilities);
    if (!abilities) {
      throw new Error("Abilities are used out of router context!");
    }
    return abilities;
  }
  function useAuthenticated() {
    let authenticated = vue.inject(StateAuthenticated);
    if (!authenticated) {
      throw new Error("Authenticated is used out of router context!");
    }
    return authenticated;
  }
  function useShared() {
    let shared = vue.inject(StateShared);
    if (!shared) {
      throw new Error("Shared state is used out of router context!");
    }
    return shared;
  }
  function useLocation() {
    let location = vue.inject(StateLocationInjectionKey);
    if (!location) {
      throw new Error("Location is used out of router context!");
    }
    return location;
  }
  function useStackSignature() {
    let signature = vue.inject(StateStackSignatureInjectionKey);
    if (!signature) {
      throw new Error("Stack signature is used out of router context!");
    }
    return signature;
  }
  function useStateManager() {
    let manager = vue.inject(StateManagerInjectionKey);
    if (!manager) {
      throw new Error("State manager is used out of router context!");
    }
    return { update: manager };
  }
  function useStateHistory() {
    let history = vue.inject(StateHistoryInjectionKey);
    if (!history) {
      throw new Error("State history is used out of router context!");
    }
    return history;
  }
  function useErrors() {
    let errors = vue.inject(StateErrorsInjectionKey);
    if (!errors) {
      throw new Error("State errors is used out of router context!");
    }
    return errors;
  }
  function updateStack(current, fresh) {
    if ("keep" in fresh) {
      if (fresh.child) {
        if (current.child) {
          current.child = updateStack(current.child, fresh.child);
        } else {
          current.child = fresh.child;
        }
        return { ...current };
      }
      return { ...current };
    }
    return { ...fresh };
  }
  class Request {
    method;
    url;
    xhr;
    body;
    signature;
    refreshStack;
    referer;
    nested;
    static send(options) {
      return new Request(options).send();
    }
    constructor({
      method,
      url: url2,
      body = void 0,
      signature = void 0,
      refreshStack = false,
      referer = void 0,
      nested = false
    }) {
      this.xhr = new XMLHttpRequest();
      this.method = method;
      this.url = url2;
      this.body = body;
      this.signature = signature;
      this.refreshStack = refreshStack;
      this.referer = referer;
      this.nested = nested;
    }
    send() {
      return new Promise((resolve, reject) => {
        this.xhr.open(this.method, this.url, true);
        this.xhr.setRequestHeader("Language", APP_LOCALE);
        this.xhr.setRequestHeader("X-Stack-Router", "true");
        this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN"));
        if (this.referer) {
          this.xhr.setRequestHeader("X-Stack-Referer", this.referer);
        }
        if (this.refreshStack) {
          this.xhr.setRequestHeader("X-Stack-Refresh", "true");
        }
        if (this.nested) {
          this.xhr.setRequestHeader("X-Stack-Nested", "true");
        }
        if (this.signature) {
          this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
        }
        this.xhr.onload = () => {
          if (this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status) {
            if (this.xhr.status < 200 || this.xhr.status >= 300) {
              if (this.xhr.status === 422) {
                reject(new CompleteResponse(this.xhr));
              } else {
                reject(new Response(this.xhr));
              }
            } else {
              resolve(new CompleteResponse(this.xhr));
            }
          }
        };
        this.xhr.onerror = () => {
          reject(new Response(this.xhr));
        };
        this.xhr.send(this.transform(this.body));
      });
    }
    transform(body) {
      if (body instanceof Blob || body instanceof ArrayBuffer || body instanceof FormData || body instanceof URLSearchParams) {
        return body;
      }
      if (typeof body === "string") {
        return body;
      }
      if (body === null) {
        return null;
      }
      this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      return JSON.stringify(body);
    }
    readCookie(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      if (match) {
        return match ? decodeURIComponent(match[3]) : "";
      }
      return "";
    }
  }
  const ErrorModal = {
    modal: void 0,
    listener: void 0,
    show(html) {
      if (typeof html === "object") {
        html = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(html)}`;
      }
      const page = document.createElement("html");
      page.innerHTML = html;
      page.querySelectorAll("a").forEach((a) => a.setAttribute("target", "_top"));
      this.modal = document.createElement("dialog");
      this.modal.style.display = "flex";
      this.modal.style.width = "100%";
      this.modal.style.height = "100dvh";
      this.modal.style.maxWidth = "100%";
      this.modal.style.maxHeight = "100dvh";
      this.modal.style.padding = "2rem";
      this.modal.style.boxSizing = "border-box";
      this.modal.style.border = "none";
      this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      this.modal.style.backdropFilter = "blur(0.125rem)";
      this.modal.addEventListener("click", () => this.hide());
      const iframe = document.createElement("iframe");
      iframe.style.backgroundColor = "white";
      iframe.style.borderRadius = "0.5rem";
      iframe.style.border = "none";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      this.modal.appendChild(iframe);
      document.body.prepend(this.modal);
      document.body.style.overflow = "hidden";
      if (!iframe.contentWindow) {
        throw new Error("iframe not yet ready.");
      }
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(page.outerHTML);
      iframe.contentWindow.document.close();
      this.listener = this.hideOnEscape.bind(this);
      this.modal.showModal();
      document.addEventListener("keydown", this.listener);
    },
    hide() {
      this.modal.outerHTML = "";
      this.modal = void 0;
      document.body.style.overflow = "visible";
      document.removeEventListener("keydown", this.listener);
    },
    hideOnEscape(event) {
      if (event.key === "Escape") {
        this.hide();
      }
    }
  };
  const subscriptions = {};
  const EventBus = {
    addEventListener(name, callback) {
      if (subscriptions[name]) {
        subscriptions[name].push(callback);
      } else {
        subscriptions[name] = [callback];
      }
    },
    removeEventListener(name, callback) {
      if (!subscriptions[name]) {
        return;
      }
      subscriptions[name] = subscriptions[name].filter((handler) => {
        return handler !== callback;
      });
      if (subscriptions[name].length === 0) {
        delete subscriptions[name];
      }
    },
    dispatch(name, event) {
      if (subscriptions[name]) {
        subscriptions[name].forEach((handler) => handler(event));
      }
      return event;
    }
  };
  const HttpClientScrollHandler = Symbol("HttpClientScrollHandler");
  const HttpClientForceScrollPreservation = Symbol("HttpClientForceScrollPreservation");
  const HttpClientForceNested = Symbol("HttpClientForceNested");
  function useHttpClient() {
    const state = useStateManager();
    const signature = useStackSignature();
    const history = useStateHistory();
    const location = useLocation();
    const scrollHandler = vue.inject(HttpClientScrollHandler, () => document.body.scroll({ behavior: "instant", left: 0, top: 0 }));
    const forceScrollPreserve = vue.inject(HttpClientForceScrollPreservation, false);
    const forceNested = vue.inject(HttpClientForceNested, false);
    async function dispatch(method, url2, { data = void 0, preserveScroll = false, replace = false, nested = false, ...options } = {}, previous = void 0) {
      document.body.classList.add("osf-loading");
      document.dispatchEvent(new Event("visit:start"));
      return await Request.send({
        ...options,
        method,
        url: url2,
        body: data,
        signature: signature.value,
        referer: location.value,
        nested: nested || forceNested
      }).then(async (response) => {
        if (previous) {
          response.abilities = { ...previous.abilities, ...response.abilities };
          response.shared = { ...previous.shared, ...response.shared };
          response.toasts = lodashMerge(previous.toasts, response.toasts);
          response.errors = lodashMerge(previous.errors, response.errors);
        }
        if (response.redirect) {
          return await handleRedirectResponse(response);
        }
        return await state.update(response).then(async (fresh) => {
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
      }).catch(async (error) => {
        if (error instanceof CompleteResponse) {
          return await state.update(error).then(() => Promise.reject(error));
        }
        if (error.status === 423) {
          EventBus.dispatch("password.confirm", { method, url: url2, options: { data, preserveScroll, replace } });
          return Promise.reject(error);
        }
        console.error(error);
        if (APP_DEBUG && error.content) {
          ErrorModal.show(error.content);
        }
        return Promise.reject(error);
      }).finally(() => {
        document.body.classList.remove("osf-loading");
        document.dispatchEvent(new Event("visit:done"));
      });
    }
    function resetScrollPosition() {
      if (scrollHandler) {
        scrollHandler();
      }
    }
    async function handleRedirectResponse(response) {
      if (response.redirect.reload) {
        return await new Promise(() => {
          window.location.href = response.redirect.target;
        });
      }
      return await dispatch("GET", response.redirect.target, {
        preserveScroll: true,
        replace: false,
        refreshStack: true
      }, response);
    }
    return {
      dispatch,
      get: async function(url2) {
        return await dispatch("GET", url2);
      },
      post: async function(url2, data = void 0) {
        return await dispatch("POST", url2, { data, preserveScroll: true });
      },
      patch: async function(url2, data = void 0) {
        return await dispatch("PATCH", url2, { data, preserveScroll: true });
      },
      put: async function(url2, data = void 0) {
        return await dispatch("PUT", url2, { data, preserveScroll: true });
      },
      delete: async function(url2, data = void 0) {
        return await dispatch("DELETE", url2, { data, preserveScroll: true });
      }
    };
  }
  const FormContextInjectionKey = Symbol("FormContext");
  function createFormContext(initialData, initialBag, initialReadonly) {
    const bags = useErrors();
    const data = vue.ref(lodashCloneDeep(vue.toValue(initialData)));
    const readonly = vue.ref(vue.toValue(initialReadonly));
    const bag = vue.ref(vue.toValue(initialBag));
    const touched = vue.ref({});
    const processing = vue.ref(false);
    const errors = vue.computed(() => bags.value[bag.value] || {});
    function touch(name) {
      lodashSet(touched.value, name, true);
    }
    function value(name, value2) {
      return lodashGet(data.value, name, value2);
    }
    function fill(name, value2) {
      lodashSet(data.value, name, value2);
    }
    vue.watch(() => vue.toValue(initialData), (value2) => data.value = lodashCloneDeep(value2));
    vue.watch(() => vue.toValue(initialBag), (value2) => bag.value = value2);
    vue.watch(() => vue.toValue(initialReadonly), (value2) => readonly.value = value2);
    return {
      data,
      errors,
      touched,
      processing,
      readonly,
      touch,
      value,
      fill
    };
  }
  function setModelWithContext(name, ctx, value) {
    if (name && ctx) {
      ctx.touch(name);
      ctx.fill(name, value);
    }
    return value;
  }
  function getModelFromContext(name, ctx, value) {
    if (name && ctx) {
      return ctx.value(name, value);
    }
    return value;
  }
  function url(uri, params, hash2, base) {
    const url2 = new URL(uri, base || APP_URL);
    if (params) {
      attachSearchParameters(url2.searchParams, params);
    }
    if (hash2) {
      url2.hash = hash2;
    }
    return url2.toString();
  }
  function attachSearchParameters(search, params) {
    Object.keys(params).forEach((key) => {
      appendSearchParameter(search, key, vue.toRaw(params[key]));
    });
  }
  function appendSearchParameter(search, name, value, prev) {
    if (prev) {
      name = prev + "[" + name + "]";
    }
    if (value == null) {
      search.set(name, "");
      return search;
    }
    if (Array.isArray(value)) {
      value.forEach((arrValue, arrIndex) => {
        appendSearchParameter(search, arrIndex.toString(), arrValue, name);
      });
      return search;
    }
    if (typeof value === "object") {
      Object.keys(value).forEach((key) => {
        appendSearchParameter(search, key, value[key], name);
      });
      return search;
    }
    if (typeof value === "boolean") {
      value = Number(value);
    }
    if (value == null) {
      value = "";
    }
    search.set(name, value);
    return search;
  }
  const FormControllerComponent = vue.defineComponent({
    name: "FormController",
    props: {
      action: {
        type: String,
        required: false
      },
      method: {
        type: String,
        required: false,
        default: "POST"
      },
      data: {
        type: Object,
        required: false,
        default: {}
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      continuous: {
        type: Boolean,
        required: false,
        default: false
      },
      bag: {
        type: String,
        required: false,
        default: "default"
      },
      onSubmit: {
        type: Function,
        required: false
      }
    },
    slots: Object,
    setup(props, { attrs, slots, expose }) {
      const parent = vue.inject(FormContextInjectionKey, null);
      const ctx = createFormContext(() => props.data, () => props.bag, () => props.readonly);
      const http = useHttpClient();
      const bags = useErrors();
      const { data, processing, readonly, errors, touched } = ctx;
      const element = vue.computed(() => {
        return parent ? "div" : "form";
      });
      const specific = vue.computed(() => {
        return parent ? {
          ["data-action"]: props.action,
          ["data-method"]: props.method
        } : {
          ["action"]: props.action,
          ["method"]: props.method
        };
      });
      function dispatch() {
        if (props.onSubmit) {
          return props.onSubmit(data.value, ctx);
        }
        if (!props.action) {
          throw new Error("You must either provide action or your custom form handler!");
        }
        if (props.method === "GET") {
          return http.dispatch(props.method, url(props.action, data.value));
        }
        return http.dispatch(props.method, props.action, { data: data.value });
      }
      function submit(event) {
        let beforeReadonly = readonly.value;
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        processing.value = true;
        if (!props.continuous) {
          readonly.value = true;
        }
        bags.value = {};
        touched.value = {};
        vue.nextTick(() => {
          dispatch().catch((error) => {
            if (error instanceof CompleteResponse) {
              bags.value = error.errors;
              if (!props.continuous) {
                vue.nextTick(() => {
                  document.querySelector(".control--error")?.scrollIntoView();
                });
              }
            }
          }).finally(() => {
            processing.value = false;
            readonly.value = beforeReadonly;
          });
        });
      }
      function handleSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        submit();
      }
      function onKeydown(event) {
        if (event.key === "Enter") {
          const target = event.target;
          if (target.tagName !== "TEXTAREA" && !target.form && element.value === "div") {
            handleSubmit(event);
          }
        }
      }
      const eventHandlers = vue.computed(() => {
        let handlers = {};
        if (element.value === "form") {
          handlers = { onSubmit: handleSubmit };
        } else if (element.value === "div") {
          handlers = { onKeydown };
        }
        if (props.continuous) {
          handlers.onChange = handleSubmit;
        }
        return handlers;
      });
      expose({
        ctx,
        submit
      });
      vue.provide(FormContextInjectionKey, ctx);
      return () => vue.h(element.value, vue.mergeProps(attrs, specific.value, eventHandlers.value, { class: "form" }), slots.default({
        data: data.value,
        processing: processing.value,
        errors: errors.value,
        touched: touched.value,
        ctx,
        submit
      }));
    }
  });
  const StackedViewResolverInjectionKey = Symbol("ViewResolver");
  const StackedViewInjectionKey = Symbol("StackedView");
  const StackedViewDepthInjectionKey = Symbol("StackedViewDepth");
  const StackedViewParentInjectionKey = Symbol("StackedViewParent");
  const StackedViewLocationInjectionKey = Symbol("StackedViewLocation");
  const StackedViewQueryInjectionKey = Symbol("StackedViewQuery");
  function wrap(item) {
    return Array.isArray(item) ? item : [item];
  }
  function useViewResolver() {
    const resolver = vue.inject(StackedViewResolverInjectionKey);
    if (!resolver) {
      throw new Error("You're trying to get ViewResolver ouf of Router context!");
    }
    return resolver;
  }
  const PreventNestedRouterViewRenderInjectionKey = Symbol("PreventNestedRouterViewRenderInjectionKey");
  function isNestedRouterViewPrevented() {
    return vue.inject(PreventNestedRouterViewRenderInjectionKey, false);
  }
  function useViewStack() {
    const view = vue.inject(StackedViewInjectionKey);
    if (!view) {
      throw new Error("You're trying to get stacked view out of Router context!");
    }
    return view;
  }
  function useViewDepth() {
    const view = vue.inject(StackedViewDepthInjectionKey);
    if (!view) {
      throw new Error("You're trying to get view depth out of Router context!");
    }
    return view;
  }
  const StackedViewLayoutInjectionKey = Symbol("StackedViewLayoutInjectionKey");
  function useStackLayout() {
    return vue.inject(StackedViewLayoutInjectionKey, () => void 0);
  }
  const RouterViewComponent = vue.defineComponent({
    inheritAttrs: false,
    name: "RouterView",
    props: {
      allowLayouts: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    slots: Object,
    setup(props, { slots }) {
      const resolver = useViewResolver();
      const defaultLayout = useStackLayout();
      const depth = useViewDepth();
      const view = useViewStack();
      const prevented = isNestedRouterViewPrevented();
      const location = vue.computed(() => view.value?.location);
      const query = vue.computed(() => view.value?.query);
      const stack = vue.computed(() => {
        if (view.value && view.value.child) {
          return { ...view.value.child, parent: view.value };
        } else {
          return void 0;
        }
      });
      vue.provide(StackedViewInjectionKey, stack);
      vue.provide(StackedViewDepthInjectionKey, vue.computed(() => depth.value + 1));
      vue.provide(StackedViewParentInjectionKey, vue.computed(() => view.value?.parent));
      vue.provide(StackedViewLocationInjectionKey, location);
      vue.provide(StackedViewQueryInjectionKey, query);
      vue.provide(HttpClientScrollHandler, () => {
        document.body.scroll({ behavior: "instant", left: 0, top: 0 });
      });
      if (prevented) {
        return () => null;
      }
      return () => {
        if (view.value && "component" in view.value) {
          let component = resolver(view.value.component);
          let viewProps = view.value.props;
          component.inheritAttrs = !!component.inheritAttrs;
          let children = vue.h(component, viewProps);
          if (depth.value === 0 && component.layout === void 0) {
            component.layout = defaultLayout;
          }
          if (props.allowLayouts && component.layout) {
            children = wrap(component.layout).concat(children).reverse().reduce((child, layout) => {
              layout = typeof layout === "string" ? resolver(layout) : layout;
              layout.inheritAttrs = !!layout.inheritAttrs;
              return vue.h(layout, viewProps, () => child);
            });
          }
          return children;
        }
        if (slots.default) {
          return slots.default();
        }
      };
    }
  });
  const RouterLinkComponent = vue.defineComponent({
    name: "RouterLink",
    props: {
      method: { type: String, required: false, default: "GET" },
      href: { type: String, required: false },
      data: { type: [Object, Array, String, null], required: false },
      preserveScroll: { type: Boolean, required: false },
      replace: { type: Boolean, required: false },
      target: { type: String, required: false },
      disabled: { type: Boolean, required: false },
      explicit: { type: Boolean, required: false }
    },
    setup(props, { attrs, slots }) {
      const location = useLocation();
      const http = useHttpClient();
      const pending = vue.ref(false);
      const active = vue.computed(() => {
        let current = location.value.replace(/\/$/, "");
        let target = props.href?.replace(/\/$/, "");
        let explicit = current === target;
        let implicit = !props.explicit && target && location.value.startsWith(target);
        return explicit || implicit;
      });
      const as = vue.computed(() => props.href ? "a" : "button");
      const specific = vue.computed(() => props.href ? { target: props.target } : { disabled: props.disabled });
      function onClick(event) {
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
        vue.nextTick(() => {
          http.dispatch(method, href, { data, preserveScroll, replace }).then(() => {
            pending.value = false;
          }).catch(() => {
            pending.value = false;
          });
        });
      }
      return () => vue.h(
        as.value,
        vue.mergeProps(attrs, specific.value, {
          href: props.href,
          class: [{ active: active.value, pending: pending.value, disabled: props.disabled }],
          onClick
        }),
        // @ts-ignore
        slots.default({ active, pending })
      );
    }
  });
  function shouldInterceptEvent(event, href, target) {
    if (target === "_blank" || isCrossOriginHref(href)) {
      return false;
    }
    return !(event.button > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
  }
  function isCrossOriginHref(href) {
    try {
      let currentOrigin = window.location.host;
      let targetOrigin = new URL(href).host;
      return currentOrigin !== targetOrigin;
    } catch (e) {
      return false;
    }
  }
  const ToastRegistryInjectionKey = Symbol("ToastRegistry");
  function useToasts() {
    let toasts = vue.inject(ToastRegistryInjectionKey);
    if (!toasts) {
      throw new Error("Toasts are used out of router context!");
    }
    return toasts;
  }
  const RouterNestedViewComponent = vue.defineComponent({
    inheritAttrs: false,
    name: "RouterNestedView",
    props: {
      action: { type: String, required: true }
    },
    slots: Object,
    setup(props, { slots }) {
      const http = useHttpClient();
      const loading = vue.ref(true);
      vue.onMounted(() => {
        http.dispatch("GET", props.action).then(() => vue.nextTick(() => {
          loading.value = false;
        }));
      });
      return () => {
        if (loading.value) {
          if (slots.default) {
            return slots.default();
          }
        } else {
          return vue.h(RouterViewComponent);
        }
      };
    }
  });
  const RouterNestedComponent = vue.defineComponent({
    inheritAttrs: false,
    name: "RouterNested",
    props: {
      action: { type: String, required: true }
    },
    slots: Object,
    setup(props, { slots }) {
      const location = vue.ref(props.action);
      const abilities = vue.ref(void 0);
      const stack = vue.ref(void 0);
      const signature = vue.ref(void 0);
      const errors = vue.ref({});
      const shared = vue.inject(StateShared);
      const authenticated = vue.inject(StateAuthenticated);
      const toasts = vue.inject(ToastRegistryInjectionKey);
      function buildState() {
        return {
          location: vue.toRaw(vue.toValue(location)),
          signature: vue.toRaw(vue.toValue(signature)),
          stack: vue.toRaw(vue.toValue(stack))
        };
      }
      async function update(fresh) {
        return await vue.nextTick(async () => {
          abilities.value = { ...abilities.value, ...fresh.abilities };
          authenticated.value = fresh.authenticated;
          errors.value = fresh.errors;
          if (fresh.location) location.value = fresh.location;
          if (fresh.stack) stack.value = updateStack(vue.toRaw(vue.toValue(stack.value)), fresh.stack);
          if (fresh.signature) signature.value = fresh.signature;
          return await vue.nextTick(() => {
            if (fresh.shared) shared.value = { ...shared.value, ...fresh.shared };
            if (fresh.toasts && fresh.toasts.length > 0) toasts.value = [...toasts.value, ...fresh.toasts];
            return buildState();
          });
        });
      }
      vue.provide(StateAbilities, abilities);
      vue.provide(StateAuthenticated, authenticated);
      vue.provide(StateErrorsInjectionKey, errors);
      vue.provide(StateLocationInjectionKey, location);
      vue.provide(StackedViewInjectionKey, stack);
      vue.provide(StateStackSignatureInjectionKey, signature);
      vue.provide(StateShared, shared);
      vue.provide(ToastRegistryInjectionKey, toasts);
      vue.provide(StateManagerInjectionKey, update);
      vue.provide(StackedViewDepthInjectionKey, vue.computed(() => 0));
      vue.provide(HttpClientForceScrollPreservation, true);
      vue.provide(HttpClientForceNested, true);
      vue.provide(StateHistoryInjectionKey, {
        historyPushState() {
        },
        historyReplaceState() {
        }
      });
      return () => {
        return vue.h(RouterNestedViewComponent, { action: props.action }, slots);
      };
    }
  });
  const RouterFrameComponent = vue.defineComponent({
    inheritAttrs: false,
    name: "RouterFrame",
    props: {
      src: { type: String, required: true }
    },
    slots: Object,
    setup(props, { slots }) {
      const resolver = useViewResolver();
      const abilities = vue.inject(StateAbilities);
      const authenticated = vue.inject(StateAuthenticated);
      const shared = vue.inject(StateShared);
      const errors = vue.inject(StateErrorsInjectionKey);
      const toasts = vue.inject(ToastRegistryInjectionKey);
      const stack = vue.inject(StackedViewInjectionKey);
      const loading = vue.ref(true);
      const view = vue.ref(void 0);
      vue.provide(HttpClientForceScrollPreservation, true);
      vue.provide(HttpClientForceNested, true);
      vue.provide(PreventNestedRouterViewRenderInjectionKey, true);
      function load() {
        Request.send({ method: "GET", url: props.src, nested: true }).then(async (response) => {
          if (response.redirect) {
            return new Promise(() => {
              window.location.href = response.redirect.target;
            });
          }
          abilities.value = { ...abilities.value, ...response.abilities };
          authenticated.value = response.authenticated;
          errors.value = { ...lodashMerge(errors.value, response.errors) };
          if (response.shared) {
            shared.value = { ...shared.value, ...response.shared };
          }
          if (response.stack) {
            view.value = updateStack(vue.toRaw(vue.toValue(view.value)), response.stack);
          }
          if (response.toasts && response.toasts.length > 0) {
            toasts.value = [...toasts.value, ...response.toasts];
          }
          await vue.nextTick();
          return Promise.resolve(response);
        }).catch(async (error) => {
          if (error.status === 423) {
            EventBus.dispatch("password.confirm", { method: "GET", url: props.src, options: { data: void 0, preserveScroll: true, replace: false } });
            return Promise.reject(error);
          }
          console.error(error);
          if (APP_DEBUG && error.content) {
            ErrorModal.show(error.content);
          }
          return Promise.reject(error);
        }).finally(() => {
          loading.value = false;
        });
      }
      vue.onMounted(() => {
        load();
      });
      vue.watch(stack, () => {
        load();
      }, {
        deep: true
      });
      return () => {
        if (view.value && "component" in view.value) {
          let component = resolver(view.value.component);
          let viewProps = view.value.props;
          component.inheritAttrs = !!component.inheritAttrs;
          return vue.h(component, viewProps);
        }
        if (slots.default) {
          return slots.default();
        }
      };
    }
  });
  const ToastControllerComponent = vue.defineComponent({
    name: "ToastController",
    slots: Object,
    // _props is a hack to avoid TS error on unused parameter as it is not used
    // at the moment it will throw a TS error, but it has to be passed to read
    // slots and attrs. Remember _ in front whenever you will actually have to
    // use the props. https://github.com/microsoft/TypeScript/issues/9458
    setup(_props, { slots, attrs }) {
      const toasts = useToasts();
      return () => vue.h("div", attrs, slots.default({ toasts: toasts.value }));
    }
  });
  const ToastComponent = vue.defineComponent({
    name: "Toast",
    props: {
      toast: { type: Object, required: true }
    },
    slots: Object,
    setup(props, { slots, attrs }) {
      const toasts = useToasts();
      const timeout = vue.ref();
      function close() {
        clearTimeout(timeout.value);
        toasts.value = toasts.value.filter((toast) => toast.id !== props.toast.id);
      }
      vue.onMounted(() => {
        timeout.value = setTimeout(() => close(), props.toast.duration * 1e3);
      });
      vue.onBeforeUnmount(() => {
        clearTimeout(timeout.value);
      });
      return () => vue.h("li", attrs, slots.default({ toast: props.toast, close }));
    }
  });
  const PasswordConfirmationControllerComponent = vue.defineComponent({
    name: "PasswordConfirmationController",
    props: {
      action: { type: String, required: true }
    },
    slots: Object,
    setup(props, { slots, attrs }) {
      const http = useHttpClient();
      const original = vue.ref();
      const open = vue.ref(false);
      function onPasswordConfirm(event) {
        original.value = event;
        open.value = true;
      }
      async function submit(data) {
        let { method, url: url2, options } = original.value;
        return await http.post(props.action, data).then(async () => {
          return await http.dispatch(method, url2, options).then(async (res) => {
            cancel();
            return await vue.nextTick(() => res);
          });
        });
      }
      function cancel() {
        open.value = false;
        original.value = void 0;
      }
      vue.onMounted(() => {
        EventBus.addEventListener("password.confirm", onPasswordConfirm);
      });
      vue.onBeforeUnmount(() => {
        EventBus.removeEventListener("password.confirm", onPasswordConfirm);
      });
      return () => vue.h("div", attrs, slots.default({ open: open.value, submit, cancel }));
    }
  });
  function trans(key, replace) {
    return makeReplacements(get(key), replace);
  }
  function transChoice(key, number, replace) {
    return makeReplacements(choose(get(key), number), replace);
  }
  function get(key) {
    let translation = APP_TRANSLATIONS[key];
    if (typeof translation === "undefined") {
      translation = key;
    }
    return translation;
  }
  function choose(line, number) {
    let segments = line.split("|");
    let value = extract(segments, number);
    if (value) {
      return value.trim();
    }
    segments = stripConditions(segments);
    let pluralIndex = getPluralIndex(number);
    if (segments.length === 1 || segments[pluralIndex] == void 0) {
      return segments[0];
    }
    return segments[pluralIndex];
  }
  function extract(segments, number) {
    for (let part in segments) {
      let line = extractFromString(part, number);
      if (line) {
        return line;
      }
    }
  }
  function extractFromString(part, number) {
    const regex = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s;
    const matches = part.match(regex);
    if (!matches || matches.length !== 3) {
      return null;
    }
    const condition = matches[1];
    const value = matches[2];
    if (condition.includes(",")) {
      const [from, to] = condition.split(",", 2);
      if (to === "*" && number >= Number(from)) {
        return value;
      } else if (from === "*" && number <= Number(to)) {
        return value;
      } else if (number >= Number(from) && number <= Number(to)) {
        return value;
      }
    }
    return Number(condition) == number ? value : null;
  }
  function stripConditions(segments) {
    return segments.map((part) => part.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
  }
  function makeReplacements(line, replace) {
    if (replace) {
      return Object.keys(replace).reduce((prev, key) => prev.replace(`:${key}`, replace[key].toString()), line);
    }
    return line;
  }
  function getPluralIndex(number) {
    switch (APP_LOCALE) {
      case "az":
      case "az_AZ":
      case "bo":
      case "bo_CN":
      case "bo_IN":
      case "dz":
      case "dz_BT":
      case "id":
      case "id_ID":
      case "ja":
      case "ja_JP":
      case "jv":
      case "ka":
      case "ka_GE":
      case "km":
      case "km_KH":
      case "kn":
      case "kn_IN":
      case "ko":
      case "ko_KR":
      case "ms":
      case "ms_MY":
      case "th":
      case "th_TH":
      case "tr":
      case "tr_CY":
      case "tr_TR":
      case "vi":
      case "vi_VN":
      case "zh":
      case "zh_CN":
      case "zh_HK":
      case "zh_SG":
      case "zh_TW":
        return 0;
      case "af":
      case "af_ZA":
      case "bn":
      case "bn_BD":
      case "bn_IN":
      case "bg":
      case "bg_BG":
      case "ca":
      case "ca_AD":
      case "ca_ES":
      case "ca_FR":
      case "ca_IT":
      case "da":
      case "da_DK":
      case "de":
      case "de_AT":
      case "de_BE":
      case "de_CH":
      case "de_DE":
      case "de_LI":
      case "de_LU":
      case "el":
      case "el_CY":
      case "el_GR":
      case "en":
      case "en_AG":
      case "en_AU":
      case "en_BW":
      case "en_CA":
      case "en_DK":
      case "en_GB":
      case "en_HK":
      case "en_IE":
      case "en_IN":
      case "en_NG":
      case "en_NZ":
      case "en_PH":
      case "en_SG":
      case "en_US":
      case "en_ZA":
      case "en_ZM":
      case "en_ZW":
      case "eo":
      case "eo_US":
      case "es":
      case "es_AR":
      case "es_BO":
      case "es_CL":
      case "es_CO":
      case "es_CR":
      case "es_CU":
      case "es_DO":
      case "es_EC":
      case "es_ES":
      case "es_GT":
      case "es_HN":
      case "es_MX":
      case "es_NI":
      case "es_PA":
      case "es_PE":
      case "es_PR":
      case "es_PY":
      case "es_SV":
      case "es_US":
      case "es_UY":
      case "es_VE":
      case "et":
      case "et_EE":
      case "eu":
      case "eu_ES":
      case "eu_FR":
      case "fa":
      case "fa_IR":
      case "fi":
      case "fi_FI":
      case "fo":
      case "fo_FO":
      case "fur":
      case "fur_IT":
      case "fy":
      case "fy_DE":
      case "fy_NL":
      case "gl":
      case "gl_ES":
      case "gu":
      case "gu_IN":
      case "ha":
      case "ha_NG":
      case "he":
      case "he_IL":
      case "hu":
      case "hu_HU":
      case "is":
      case "is_IS":
      case "it":
      case "it_CH":
      case "it_IT":
      case "ku":
      case "ku_TR":
      case "lb":
      case "lb_LU":
      case "ml":
      case "ml_IN":
      case "mn":
      case "mn_MN":
      case "mr":
      case "mr_IN":
      case "nah":
      case "nb":
      case "nb_NO":
      case "ne":
      case "ne_NP":
      case "nl":
      case "nl_AW":
      case "nl_BE":
      case "nl_NL":
      case "nn":
      case "nn_NO":
      case "no":
      case "om":
      case "om_ET":
      case "om_KE":
      case "or":
      case "or_IN":
      case "pa":
      case "pa_IN":
      case "pa_PK":
      case "pap":
      case "pap_AN":
      case "pap_AW":
      case "pap_CW":
      case "ps":
      case "ps_AF":
      case "pt":
      case "pt_BR":
      case "pt_PT":
      case "so":
      case "so_DJ":
      case "so_ET":
      case "so_KE":
      case "so_SO":
      case "sq":
      case "sq_AL":
      case "sq_MK":
      case "sv":
      case "sv_FI":
      case "sv_SE":
      case "sw":
      case "sw_KE":
      case "sw_TZ":
      case "ta":
      case "ta_IN":
      case "ta_LK":
      case "te":
      case "te_IN":
      case "tk":
      case "tk_TM":
      case "ur":
      case "ur_IN":
      case "ur_PK":
      case "zu":
      case "zu_ZA":
        return number == 1 ? 0 : 1;
      case "am":
      case "am_ET":
      case "bh":
      case "fil":
      case "fil_PH":
      case "fr":
      case "fr_BE":
      case "fr_CA":
      case "fr_CH":
      case "fr_FR":
      case "fr_LU":
      case "gun":
      case "hi":
      case "hi_IN":
      case "hy":
      case "hy_AM":
      case "ln":
      case "ln_CD":
      case "mg":
      case "mg_MG":
      case "nso":
      case "nso_ZA":
      case "ti":
      case "ti_ER":
      case "ti_ET":
      case "wa":
      case "wa_BE":
      case "xbr":
        return number == 0 || number == 1 ? 0 : 1;
      case "be":
      case "be_BY":
      case "bs":
      case "bs_BA":
      case "hr":
      case "hr_HR":
      case "ru":
      case "ru_RU":
      case "ru_UA":
      case "sr":
      case "sr_ME":
      case "sr_RS":
      case "uk":
      case "uk_UA":
        return number % 10 == 1 && number % 100 != 11 ? 0 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20) ? 1 : 2;
      case "cs":
      case "cs_CZ":
      case "sk":
      case "sk_SK":
        return number == 1 ? 0 : number >= 2 && number <= 4 ? 1 : 2;
      case "ga":
      case "ga_IE":
        return number == 1 ? 0 : number == 2 ? 1 : 2;
      case "lt":
      case "lt_LT":
        return number % 10 == 1 && number % 100 != 11 ? 0 : number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20) ? 1 : 2;
      case "sl":
      case "sl_SI":
        return number % 100 == 1 ? 0 : number % 100 == 2 ? 1 : number % 100 == 3 || number % 100 == 4 ? 2 : 3;
      case "mk":
      case "mk_MK":
        return number % 10 == 1 ? 0 : 1;
      case "mt":
      case "mt_MT":
        return number == 1 ? 0 : number == 0 || number % 100 > 1 && number % 100 < 11 ? 1 : number % 100 > 10 && number % 100 < 20 ? 2 : 3;
      case "lv":
      case "lv_LV":
        return number == 0 ? 0 : number % 10 == 1 && number % 100 != 11 ? 1 : 2;
      case "pl":
      case "pl_PL":
        return number == 1 ? 0 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14) ? 1 : 2;
      case "cy":
      case "cy_GB":
        return number == 1 ? 0 : number == 2 ? 1 : number == 8 || number == 11 ? 2 : 3;
      case "ro":
      case "ro_RO":
        return number == 1 ? 0 : number == 0 || number % 100 > 0 && number % 100 < 20 ? 1 : 2;
      case "ar":
      case "ar_AE":
      case "ar_BH":
      case "ar_DZ":
      case "ar_EG":
      case "ar_IN":
      case "ar_IQ":
      case "ar_JO":
      case "ar_KW":
      case "ar_LB":
      case "ar_LY":
      case "ar_MA":
      case "ar_OM":
      case "ar_QA":
      case "ar_SA":
      case "ar_SD":
      case "ar_SS":
      case "ar_SY":
      case "ar_TN":
      case "ar_YE":
        return number == 0 ? 0 : number == 1 ? 1 : number == 2 ? 2 : number % 100 >= 3 && number % 100 <= 10 ? 3 : number % 100 >= 11 && number % 100 <= 99 ? 4 : 5;
      default:
        return 0;
    }
  }
  function route(name, params = {}, hash2) {
    return build(localizeName(name), params, hash2);
  }
  function localizeName(name) {
    if (name.startsWith(APP_FALLBACK_LOCALE)) {
      return name.replace(`${APP_FALLBACK_LOCALE}.`, "");
    }
    if (APP_AVAILABLE_LOCALES.findIndex((lang) => name.startsWith(lang)) >= 0) {
      return name;
    }
    if (!name.startsWith("web.")) {
      return name;
    }
    if (APP_LOCALE !== APP_FALLBACK_LOCALE) {
      return `${APP_LOCALE}.${name}`;
    }
    return name;
  }
  function build(name, params, hash2) {
    const route2 = APP_ROUTES[name];
    if (!route2) {
      throw new Error(`Undefined route: ${name}`);
    }
    const uri = replaceRouteParameters(route2, params);
    const search = Object.keys(params).reduce((prev, key) => {
      if (!route2.params.includes(key)) {
        prev[key] = vue.toRaw(params[key]);
      }
      return prev;
    }, {});
    return url(uri, search, hash2, route2.domain);
  }
  function replaceRouteParameters(route2, params) {
    return route2.params.reduce((uri, param) => {
      let binding = route2.binding[param] || "id";
      let value = vue.toRaw(params[param]);
      if (typeof value === "object") {
        value = value[binding];
      }
      if (!value) {
        if (!uri.match(new RegExp(`{${param}\\?}`))) {
          throw new Error(`Parameter ${param} is required for uri ${route2.uri}.`);
        }
      }
      uri = uri.replace(new RegExp(`{${param}\\??}`), value ?? "");
      if (uri.endsWith("/")) {
        uri = uri.slice(0, -1);
      }
      return uri;
    }, route2.uri);
  }
  function updateHead(meta) {
    if (!meta) {
      return meta;
    }
    document.head.querySelectorAll("[data-fdn]").forEach((element) => element.remove());
    meta.forEach((tag) => {
      let element;
      switch (tag.type) {
        case "title":
          element = document.createElement("title");
          element.innerHTML = tag.content;
          break;
        case "meta":
          element = document.createElement("meta");
          element.setAttribute("name", tag.name);
          element.setAttribute("content", tag.content);
          break;
        case "link":
          element = document.createElement("link");
          element.setAttribute("rel", tag.rel);
          element.setAttribute("href", tag.href);
          break;
        case "snippet":
          element = document.createElement("script");
          element.setAttribute("type", "application/ld+json");
          element.innerHTML = tag.content;
          break;
      }
      element.setAttribute("data-fdn", "");
      document.head.append(element);
    });
    return meta;
  }
  const RouterComponent = vue.defineComponent({
    inheritAttrs: false,
    name: "Router",
    props: {
      resolver: {
        type: Function,
        required: true
      },
      state: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const abilities = vue.ref(props.state.abilities);
      const errors = vue.ref(props.state.errors);
      const meta = vue.ref(props.state.meta);
      const shared = vue.ref(props.state.shared || {});
      const authenticated = vue.ref(props.state.authenticated);
      const location = vue.ref(props.state.location);
      const stack = vue.ref(props.state.stack);
      const signature = vue.ref(props.state.signature);
      const toasts = vue.ref(props.state.toasts);
      function buildState() {
        return {
          meta: vue.toRaw(vue.toValue(meta)),
          location: vue.toRaw(vue.toValue(location)),
          signature: vue.toRaw(vue.toValue(signature)),
          stack: vue.toRaw(vue.toValue(stack))
        };
      }
      async function update(fresh) {
        return await vue.nextTick(async () => {
          abilities.value = { ...abilities.value, ...fresh.abilities };
          authenticated.value = fresh.authenticated;
          errors.value = fresh.errors;
          if (fresh.meta) meta.value = updateHead(fresh.meta);
          if (fresh.stack) stack.value = updateStack(vue.toRaw(vue.toValue(stack.value)), fresh.stack);
          if (fresh.location) location.value = fresh.location;
          if (fresh.signature) signature.value = fresh.signature;
          return await vue.nextTick(() => {
            if (fresh.shared) shared.value = { ...shared.value, ...fresh.shared };
            if (fresh.toasts && fresh.toasts.length > 0) toasts.value = [...toasts.value, ...fresh.toasts];
            return buildState();
          });
        });
      }
      vue.provide(StateAbilities, abilities);
      vue.provide(StateAuthenticated, authenticated);
      vue.provide(StateShared, shared);
      vue.provide(StateLocationInjectionKey, location);
      vue.provide(StateStackSignatureInjectionKey, signature);
      vue.provide(StateErrorsInjectionKey, errors);
      vue.provide(StateManagerInjectionKey, update);
      vue.provide(StackedViewResolverInjectionKey, props.resolver);
      vue.provide(StackedViewDepthInjectionKey, vue.computed(() => 0));
      vue.provide(StackedViewInjectionKey, stack);
      vue.provide(ToastRegistryInjectionKey, toasts);
      vue.provide(StateHistoryInjectionKey, {
        historyPushState(state) {
          window.history.pushState(state, "", state.location);
        },
        historyReplaceState(state) {
          window.history.replaceState(state, "", state.location);
        }
      });
      function handlePopStateEvent(event) {
        if (event.state) {
          location.value = event.state.location;
          stack.value = event.state.stack;
          signature.value = event.state.signature;
        } else {
          window.history.replaceState(buildState(), "", location.value);
          document.body.scroll({ behavior: "instant", left: 0, top: 0 });
        }
      }
      vue.onMounted(() => {
        window.history.replaceState(buildState(), "", location.value);
        window.addEventListener("popstate", handlePopStateEvent);
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("popstate", handlePopStateEvent);
      });
      return () => {
        return vue.h(RouterViewComponent);
      };
    }
  });
  async function createFoundationController({ initial, resolver, setup }) {
    const isServer = typeof window === "undefined";
    const state = initial || readInitialState();
    const app = setup({ router: RouterComponent, props: { resolver, state } });
    if (isServer) {
      return await serverRenderer.renderToString(app);
    }
    return "";
  }
  function readInitialState() {
    let element = document.getElementById("fdn-init");
    if (!element || !element.textContent) {
      throw new Error("Cannot find initial script element with MVC state.");
    }
    return JSON.parse(element.textContent);
  }
  const confirmation = vue.ref();
  async function createConfirmation(config, callback) {
    return new Promise((resolve, reject) => {
      function confirm() {
        confirmation.value.processing = true;
        vue.nextTick(() => {
          Promise.resolve(callback()).then((value) => {
            confirmation.value = void 0;
            vue.nextTick(() => resolve(value));
          }).catch((error) => {
            confirmation.value = void 0;
            vue.nextTick(() => reject(error));
          });
        });
      }
      function cancel() {
        confirmation.value = void 0;
        vue.nextTick(() => reject());
      }
      confirmation.value = { ...config, processing: false, confirm, cancel };
    });
  }
  async function factory(configOrCallback, callback) {
    if (callback === void 0) {
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
  function useCurrentConfirmation() {
    return confirmation;
  }
  function useConfirmation() {
    return factory;
  }
  function useFormApi() {
    return vue.ref();
  }
  function useFormContext() {
    return vue.inject(FormContextInjectionKey, null);
  }
  function usePersistentFormContext() {
    let context = vue.inject(FormContextInjectionKey);
    if (!context) {
      throw new Error("Accessing form outside of context.");
    }
    return context;
  }
  function useViewLocation() {
    const view = vue.inject(StackedViewLocationInjectionKey);
    if (!view) {
      throw new Error("You're trying to get stacked view parent out of Router context!");
    }
    return view;
  }
  function useViewParent() {
    const view = vue.inject(StackedViewParentInjectionKey);
    if (!view) {
      throw new Error("You're trying to get parent view out of Router context!");
    }
    return view;
  }
  function useViewParentLocation() {
    const parent = useViewParent();
    return vue.computed(() => {
      if (parent && parent.value && parent.value.location) {
        return url(parent.value.location, parent.value.query);
      }
    });
  }
  function useViewQuery() {
    const view = vue.inject(StackedViewQueryInjectionKey);
    if (!view) {
      throw new Error("You're trying to get stacked view query params out of Router context!");
    }
    return view;
  }
  function groupBy(array, key) {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  }
  function isCountryImplicit(country) {
    if (country) {
      return APP_COUNTRIES_IMPLICITLY_ADDRESSES.includes(country);
    }
    return false;
  }
  function isCountryExplicit(country) {
    return !isCountryImplicit(country);
  }
  function blank(value) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return false;
    }
    if (typeof value === "string") {
      return value.trim() === "";
    }
    if (value instanceof Array) {
      return value.length > 0;
    }
    if (value instanceof Set || value instanceof Map) {
      return value.size > 0;
    }
    return !value;
  }
  function filled(value) {
    return !blank(value);
  }
  function hash(length = 16) {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))), (b) => ("0" + (b & 255).toString(16)).slice(-2)).join("");
  }
  function nestedSetRoot(data) {
    return data.filter((node) => node.parent === null);
  }
  function nestedSetChildren(data, item) {
    return data.filter((node) => node.left > item.left && node.right < item.right && node.parent === item.id);
  }
  function nestedSetAncestors(data, item) {
    return data.filter((node) => node.left < item.left && node.right > item.right);
  }
  function nestedSetDescendants(data, item) {
    return data.filter((node) => node.left > item.left && node.right < item.right);
  }
  function random(length, characterSet = void 0) {
    let result = "";
    const characters = characterSet || "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function findScrollParent(element) {
    if (!element) {
      return void 0;
    }
    if (Array.isArray(element)) {
      if (element.length === 0) {
        return void 0;
      }
      element = element[0];
    }
    let parent = element;
    while (parent) {
      const { overflow } = window.getComputedStyle(parent);
      if (overflow.split(" ").some((o) => o === "auto" || o === "scroll")) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return document.documentElement;
  }
  const ToastKind = {
    SUCCESS: "success",
    DANGER: "danger",
    INFO: "info",
    WARNING: "warning"
  };
  function createOtherSoftwareFoundation(options = {}) {
    return {
      install(app) {
        app.component("RouterFrame", RouterFrameComponent);
        app.component("RouterNested", RouterNestedComponent);
        app.component("RouterView", RouterViewComponent);
        app.component("RouterLink", RouterLinkComponent);
        app.component("FormController", FormControllerComponent);
        app.component("PasswordConfirmationController", PasswordConfirmationControllerComponent);
        app.component("ToastController", ToastControllerComponent);
        app.component("Toast", ToastComponent);
        app.provide(StackedViewLayoutInjectionKey, options.layout);
        app.config.globalProperties.$t = trans;
        app.config.globalProperties.$tc = transChoice;
        app.config.globalProperties.$route = route;
      }
    };
  }
  exports2.CompleteResponse = CompleteResponse;
  exports2.ErrorModal = ErrorModal;
  exports2.EventBus = EventBus;
  exports2.FormContextInjectionKey = FormContextInjectionKey;
  exports2.FormControllerComponent = FormControllerComponent;
  exports2.HttpClientForceNested = HttpClientForceNested;
  exports2.HttpClientForceScrollPreservation = HttpClientForceScrollPreservation;
  exports2.HttpClientScrollHandler = HttpClientScrollHandler;
  exports2.PreventNestedRouterViewRenderInjectionKey = PreventNestedRouterViewRenderInjectionKey;
  exports2.Request = Request;
  exports2.Response = Response;
  exports2.RouterComponent = RouterComponent;
  exports2.RouterFrameComponent = RouterFrameComponent;
  exports2.RouterLinkComponent = RouterLinkComponent;
  exports2.RouterNestedComponent = RouterNestedComponent;
  exports2.RouterViewComponent = RouterViewComponent;
  exports2.StackedViewDepthInjectionKey = StackedViewDepthInjectionKey;
  exports2.StackedViewInjectionKey = StackedViewInjectionKey;
  exports2.StackedViewLayoutInjectionKey = StackedViewLayoutInjectionKey;
  exports2.StackedViewLocationInjectionKey = StackedViewLocationInjectionKey;
  exports2.StackedViewParentInjectionKey = StackedViewParentInjectionKey;
  exports2.StackedViewQueryInjectionKey = StackedViewQueryInjectionKey;
  exports2.StackedViewResolverInjectionKey = StackedViewResolverInjectionKey;
  exports2.StateAbilities = StateAbilities;
  exports2.StateAuthenticated = StateAuthenticated;
  exports2.StateErrorsInjectionKey = StateErrorsInjectionKey;
  exports2.StateHistoryInjectionKey = StateHistoryInjectionKey;
  exports2.StateLocationInjectionKey = StateLocationInjectionKey;
  exports2.StateManagerInjectionKey = StateManagerInjectionKey;
  exports2.StateShared = StateShared;
  exports2.StateStackSignatureInjectionKey = StateStackSignatureInjectionKey;
  exports2.ToastComponent = ToastComponent;
  exports2.ToastControllerComponent = ToastControllerComponent;
  exports2.ToastKind = ToastKind;
  exports2.ToastRegistryInjectionKey = ToastRegistryInjectionKey;
  exports2.blank = blank;
  exports2.createFormContext = createFormContext;
  exports2.createFoundationController = createFoundationController;
  exports2.createOtherSoftwareFoundation = createOtherSoftwareFoundation;
  exports2.filled = filled;
  exports2.findScrollParent = findScrollParent;
  exports2.getModelFromContext = getModelFromContext;
  exports2.groupBy = groupBy;
  exports2.hash = hash;
  exports2.isCountryExplicit = isCountryExplicit;
  exports2.isCountryImplicit = isCountryImplicit;
  exports2.isNestedRouterViewPrevented = isNestedRouterViewPrevented;
  exports2.nestedSetAncestors = nestedSetAncestors;
  exports2.nestedSetChildren = nestedSetChildren;
  exports2.nestedSetDescendants = nestedSetDescendants;
  exports2.nestedSetRoot = nestedSetRoot;
  exports2.random = random;
  exports2.route = route;
  exports2.setModelWithContext = setModelWithContext;
  exports2.trans = trans;
  exports2.transChoice = transChoice;
  exports2.updateStack = updateStack;
  exports2.url = url;
  exports2.useAbilities = useAbilities;
  exports2.useAuthenticated = useAuthenticated;
  exports2.useConfirmation = useConfirmation;
  exports2.useCurrentConfirmation = useCurrentConfirmation;
  exports2.useErrors = useErrors;
  exports2.useFormApi = useFormApi;
  exports2.useFormContext = useFormContext;
  exports2.useHttpClient = useHttpClient;
  exports2.useLocation = useLocation;
  exports2.usePersistentFormContext = usePersistentFormContext;
  exports2.useShared = useShared;
  exports2.useStackLayout = useStackLayout;
  exports2.useStackSignature = useStackSignature;
  exports2.useStateHistory = useStateHistory;
  exports2.useStateManager = useStateManager;
  exports2.useToasts = useToasts;
  exports2.useViewDepth = useViewDepth;
  exports2.useViewLocation = useViewLocation;
  exports2.useViewParent = useViewParent;
  exports2.useViewParentLocation = useViewParentLocation;
  exports2.useViewQuery = useViewQuery;
  exports2.useViewResolver = useViewResolver;
  exports2.useViewStack = useViewStack;
  exports2.wrap = wrap;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=other-software-foundation.umd.cjs.map

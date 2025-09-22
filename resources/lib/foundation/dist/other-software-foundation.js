import { inject, ref, toValue, computed, watch, toRaw as toRaw$1, defineComponent, provide, h, mergeProps, nextTick, onMounted, onBeforeUnmount, ssrUtils, initDirectivesForSSR, createApp, createVNode, ssrContextKey, warn, Fragment, Static, Comment, Text } from "vue";
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
  let abilities = inject(StateAbilities);
  if (!abilities) {
    throw new Error("Abilities are used out of router context!");
  }
  return abilities;
}
function useAuthenticated() {
  let authenticated = inject(StateAuthenticated);
  if (!authenticated) {
    throw new Error("Authenticated is used out of router context!");
  }
  return authenticated;
}
function useShared() {
  let shared = inject(StateShared);
  if (!shared) {
    throw new Error("Shared state is used out of router context!");
  }
  return shared;
}
function useLocation() {
  let location = inject(StateLocationInjectionKey);
  if (!location) {
    throw new Error("Location is used out of router context!");
  }
  return location;
}
function useStackSignature() {
  let signature = inject(StateStackSignatureInjectionKey);
  if (!signature) {
    throw new Error("Stack signature is used out of router context!");
  }
  return signature;
}
function useStateManager() {
  let manager = inject(StateManagerInjectionKey);
  if (!manager) {
    throw new Error("State manager is used out of router context!");
  }
  return { update: manager };
}
function useStateHistory() {
  let history = inject(StateHistoryInjectionKey);
  if (!history) {
    throw new Error("State history is used out of router context!");
  }
  return history;
}
function useErrors() {
  let errors = inject(StateErrorsInjectionKey);
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
    return match ? decodeURIComponent(match[3]) : "";
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
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lodash_merge = { exports: {} };
lodash_merge.exports;
var hasRequiredLodash_merge;
function requireLodash_merge() {
  if (hasRequiredLodash_merge) return lodash_merge.exports;
  hasRequiredLodash_merge = 1;
  (function(module, exports) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var objectCtorString = funcToString.call(Object);
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array2 = root.Uint8Array;
    Buffer ? Buffer.allocUnsafe : void 0;
    var getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    }();
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeMax = Math.max, nativeNow = Date.now;
    var Map2 = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
    var baseCreate = /* @__PURE__ */ function() {
      function object() {
      }
      return function(proto) {
        if (!isObject2(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if (!(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    var baseFor = createBaseFor();
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction2(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeysIn(object) {
      if (!isObject2(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseMerge(object, source, srcIndex, customizer, stack2) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack2 || (stack2 = new Stack());
        if (isObject2(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack2);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack2) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack2) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack2.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack2) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray2(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray2(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject2(objValue) || isFunction2(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack2.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack2);
        stack2["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    function cloneBuffer(buffer2, isDeep) {
      {
        return buffer2.slice();
      }
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer2 = cloneArrayBuffer(typedArray.buffer);
      return new typedArray.constructor(buffer2, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject2(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function overRest(func, start, transform) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    var setToString = shortOut(baseSetToString);
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray2 = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction2(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction2(value) {
      if (!isObject2(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeysIn(object);
    }
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    function constant(value) {
      return function() {
        return value;
      };
    }
    function identity(value) {
      return value;
    }
    function stubFalse() {
      return false;
    }
    module.exports = merge;
  })(lodash_merge, lodash_merge.exports);
  return lodash_merge.exports;
}
var lodash_mergeExports = requireLodash_merge();
const lodashMerge = /* @__PURE__ */ getDefaultExportFromCjs(lodash_mergeExports);
const HttpClientScrollHandler = Symbol("HttpClientScrollHandler");
const HttpClientForceScrollPreservation = Symbol("HttpClientForceScrollPreservation");
const HttpClientForceNested = Symbol("HttpClientForceNested");
function useHttpClient() {
  const state = useStateManager();
  const signature = useStackSignature();
  const history = useStateHistory();
  const location = useLocation();
  const scrollHandler = inject(HttpClientScrollHandler, () => document.body.scroll({ behavior: "instant", left: 0, top: 0 }));
  const forceScrollPreserve = inject(HttpClientForceScrollPreservation, false);
  const forceNested = inject(HttpClientForceNested, false);
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
var lodash_clonedeep = { exports: {} };
lodash_clonedeep.exports;
var hasRequiredLodash_clonedeep;
function requireLodash_clonedeep() {
  if (hasRequiredLodash_clonedeep) return lodash_clonedeep.exports;
  hasRequiredLodash_clonedeep = 1;
  (function(module, exports) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reFlags = /\w*$/;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    function addMapEntry(map, pair) {
      map.set(pair[0], pair[1]);
      return map;
    }
    function addSetEntry(set, value) {
      set.add(value);
      return set;
    }
    function arrayEach(array, iteratee) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array2 = root.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
    var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
    var DataView = getNative(root, "DataView"), Map2 = getNative(root, "Map"), Promise2 = getNative(root, "Promise"), Set2 = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    function stackClear() {
      this.__data__ = new ListCache();
    }
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var result = isArray2(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if (hasOwnProperty.call(value, key) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        object[key] = value;
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    function baseClone(value, isDeep, isFull, customizer, key, object, stack2) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack2) : customizer(value);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject2(value)) {
        return value;
      }
      var isArr = isArray2(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      stack2 || (stack2 = new Stack());
      var stacked = stack2.get(value);
      if (stacked) {
        return stacked;
      }
      stack2.set(value, result);
      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      arrayEach(props || value, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value[key2];
        }
        assignValue(result, key2, baseClone(subValue, isDeep, isFull, customizer, key2, value, stack2));
      });
      return result;
    }
    function baseCreate(proto) {
      return isObject2(proto) ? objectCreate(proto) : {};
    }
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray2(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    function baseGetTag(value) {
      return objectToString.call(value);
    }
    function baseIsNative(value) {
      if (!isObject2(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction2(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function cloneBuffer(buffer2, isDeep) {
      if (isDeep) {
        return buffer2.slice();
      }
      var result = new buffer2.constructor(buffer2.length);
      buffer2.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    function cloneDataView(dataView, isDeep) {
      var buffer2 = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer2, dataView.byteOffset, dataView.byteLength);
    }
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor());
    }
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer2 = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer2, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = void 0;
        assignValue(object, key, newValue === void 0 ? source[key] : newValue);
      }
      return object;
    }
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function initCloneArray(array) {
      var length = array.length, result = array.constructor(length);
      if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
          return new Ctor(+object);
        case dataViewTag:
          return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);
        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);
        case numberTag:
        case stringTag:
          return new Ctor(object);
        case regexpTag:
          return cloneRegExp(object);
        case setTag:
          return cloneSet(object, isDeep, cloneFunc);
        case symbolTag:
          return cloneSymbol(object);
      }
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray2 = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction2(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction2(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function stubArray() {
      return [];
    }
    function stubFalse() {
      return false;
    }
    module.exports = cloneDeep;
  })(lodash_clonedeep, lodash_clonedeep.exports);
  return lodash_clonedeep.exports;
}
var lodash_clonedeepExports = requireLodash_clonedeep();
const lodashCloneDeep = /* @__PURE__ */ getDefaultExportFromCjs(lodash_clonedeepExports);
var lodash_set;
var hasRequiredLodash_set;
function requireLodash_set() {
  if (hasRequiredLodash_set) return lodash_set;
  hasRequiredLodash_set = 1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var MAX_SAFE_INTEGER = 9007199254740991;
  var funcTag = "[object Function]", genTag = "[object GeneratorFunction]", symbolTag = "[object Symbol]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Symbol2 = root.Symbol, splice = arrayProto.splice;
  var Map2 = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      object[key] = value;
    }
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction2(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseSet(object, path, value, customizer) {
    if (!isObject2(object)) {
      return object;
    }
    path = isKey(path, object) ? [path] : castPath(path);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = void 0;
        if (newValue === void 0) {
          newValue = isObject2(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  function castPath(value) {
    return isArray2(value) ? value : stringToPath(value);
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKey(value, object) {
    if (isArray2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var stringToPath = memoize(function(string) {
    string = toString(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArray2 = Array.isArray;
  function isFunction2(value) {
    var tag = isObject2(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function set(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }
  lodash_set = set;
  return lodash_set;
}
var lodash_setExports = requireLodash_set();
const lodashSet = /* @__PURE__ */ getDefaultExportFromCjs(lodash_setExports);
var lodash_get;
var hasRequiredLodash_get;
function requireLodash_get() {
  if (hasRequiredLodash_get) return lodash_get;
  hasRequiredLodash_get = 1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var funcTag = "[object Function]", genTag = "[object GeneratorFunction]", symbolTag = "[object Symbol]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Symbol2 = root.Symbol, splice = arrayProto.splice;
  var Map2 = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction2(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  function castPath(value) {
    return isArray2(value) ? value : stringToPath(value);
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  function isKey(value, object) {
    if (isArray2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var stringToPath = memoize(function(string) {
    string = toString(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArray2 = Array.isArray;
  function isFunction2(value) {
    var tag = isObject2(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function get2(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  lodash_get = get2;
  return lodash_get;
}
var lodash_getExports = requireLodash_get();
const lodashGet = /* @__PURE__ */ getDefaultExportFromCjs(lodash_getExports);
const FormContextInjectionKey = Symbol("FormContext");
function createFormContext(initialData, initialBag, initialReadonly) {
  const bags = useErrors();
  const data = ref(lodashCloneDeep(toValue(initialData)));
  const readonly = ref(toValue(initialReadonly));
  const bag = ref(toValue(initialBag));
  const touched = ref({});
  const processing = ref(false);
  const errors = computed(() => bags.value[bag.value] || {});
  function touch(name) {
    lodashSet(touched.value, name, true);
  }
  function value(name, value2) {
    return lodashGet(data.value, name, value2);
  }
  function fill(name, value2) {
    lodashSet(data.value, name, value2);
  }
  watch(() => toValue(initialData), (value2) => data.value = lodashCloneDeep(value2));
  watch(() => toValue(initialBag), (value2) => bag.value = value2);
  watch(() => toValue(initialReadonly), (value2) => readonly.value = value2);
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
    appendSearchParameter(search, key, toRaw$1(params[key]));
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
const FormControllerComponent = defineComponent({
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
    const parent = inject(FormContextInjectionKey, null);
    const ctx = createFormContext(() => props.data, () => props.bag, () => props.readonly);
    const http = useHttpClient();
    const bags = useErrors();
    const { data, processing, readonly, errors, touched } = ctx;
    const element = computed(() => {
      return parent ? "div" : "form";
    });
    const specific = computed(() => {
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
      nextTick(() => {
        dispatch().catch((error) => {
          if (error instanceof CompleteResponse) {
            bags.value = error.errors;
            if (!props.continuous) {
              nextTick(() => {
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
    const eventHandlers = computed(() => {
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
    provide(FormContextInjectionKey, ctx);
    return () => h(element.value, mergeProps(attrs, specific.value, eventHandlers.value, { class: "form" }), slots.default({
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
  const resolver = inject(StackedViewResolverInjectionKey);
  if (!resolver) {
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  }
  return resolver;
}
const PreventNestedRouterViewRenderInjectionKey = Symbol("PreventNestedRouterViewRenderInjectionKey");
function isNestedRouterViewPrevented() {
  return inject(PreventNestedRouterViewRenderInjectionKey, false);
}
function useViewStack() {
  const view = inject(StackedViewInjectionKey);
  if (!view) {
    throw new Error("You're trying to get stacked view out of Router context!");
  }
  return view;
}
function useViewDepth() {
  const view = inject(StackedViewDepthInjectionKey);
  if (!view) {
    throw new Error("You're trying to get view depth out of Router context!");
  }
  return view;
}
const StackedViewLayoutInjectionKey = Symbol("StackedViewLayoutInjectionKey");
function useStackLayout() {
  return inject(StackedViewLayoutInjectionKey, () => void 0);
}
const RouterViewComponent = defineComponent({
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
    const location = computed(() => view.value?.location);
    const query = computed(() => view.value?.query);
    const stack2 = computed(() => {
      if (view.value && view.value.child) {
        return { ...view.value.child, parent: view.value };
      } else {
        return void 0;
      }
    });
    provide(StackedViewInjectionKey, stack2);
    provide(StackedViewDepthInjectionKey, computed(() => depth.value + 1));
    provide(StackedViewParentInjectionKey, computed(() => view.value?.parent));
    provide(StackedViewLocationInjectionKey, location);
    provide(StackedViewQueryInjectionKey, query);
    provide(HttpClientScrollHandler, () => {
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
        let children = h(component, viewProps);
        if (depth.value === 0 && component.layout === void 0) {
          component.layout = defaultLayout;
        }
        if (props.allowLayouts && component.layout) {
          children = wrap(component.layout).concat(children).reverse().reduce((child, layout) => {
            layout = typeof layout === "string" ? resolver(layout) : layout;
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
  }
});
const RouterLinkComponent = defineComponent({
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
    const pending = ref(false);
    const active = computed(() => {
      let current = location.value.replace(/\/$/, "");
      let target = props.href?.replace(/\/$/, "");
      let explicit = current === target;
      let implicit = !props.explicit && target && location.value.startsWith(target);
      return explicit || implicit;
    });
    const as = computed(() => props.href ? "a" : "button");
    const specific = computed(() => props.href ? { target: props.target } : { disabled: props.disabled });
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
  let toasts = inject(ToastRegistryInjectionKey);
  if (!toasts) {
    throw new Error("Toasts are used out of router context!");
  }
  return toasts;
}
const RouterNestedViewComponent = defineComponent({
  inheritAttrs: false,
  name: "RouterNestedView",
  props: {
    action: { type: String, required: true }
  },
  slots: Object,
  setup(props, { slots }) {
    const http = useHttpClient();
    const loading = ref(true);
    onMounted(() => {
      http.dispatch("GET", props.action).then(() => nextTick(() => {
        loading.value = false;
      }));
    });
    return () => {
      if (loading.value) {
        if (slots.default) {
          return slots.default();
        }
      } else {
        return h(RouterViewComponent);
      }
    };
  }
});
const RouterNestedComponent = defineComponent({
  inheritAttrs: false,
  name: "RouterNested",
  props: {
    action: { type: String, required: true }
  },
  slots: Object,
  setup(props, { slots }) {
    const location = ref(props.action);
    const abilities = ref(void 0);
    const stack2 = ref(void 0);
    const signature = ref(void 0);
    const errors = ref({});
    const shared = inject(StateShared);
    const authenticated = inject(StateAuthenticated);
    const toasts = inject(ToastRegistryInjectionKey);
    function buildState() {
      return {
        location: toRaw$1(toValue(location)),
        signature: toRaw$1(toValue(signature)),
        stack: toRaw$1(toValue(stack2))
      };
    }
    async function update(fresh) {
      return await nextTick(async () => {
        abilities.value = { ...abilities.value, ...fresh.abilities };
        authenticated.value = fresh.authenticated;
        errors.value = fresh.errors;
        if (fresh.location) location.value = fresh.location;
        if (fresh.stack) stack2.value = updateStack(toRaw$1(toValue(stack2.value)), fresh.stack);
        if (fresh.signature) signature.value = fresh.signature;
        return await nextTick(() => {
          if (fresh.shared) shared.value = { ...shared.value, ...fresh.shared };
          if (fresh.toasts && fresh.toasts.length > 0) toasts.value = [...toasts.value, ...fresh.toasts];
          return buildState();
        });
      });
    }
    provide(StateAbilities, abilities);
    provide(StateAuthenticated, authenticated);
    provide(StateErrorsInjectionKey, errors);
    provide(StateLocationInjectionKey, location);
    provide(StackedViewInjectionKey, stack2);
    provide(StateStackSignatureInjectionKey, signature);
    provide(StateShared, shared);
    provide(ToastRegistryInjectionKey, toasts);
    provide(StateManagerInjectionKey, update);
    provide(StackedViewDepthInjectionKey, computed(() => 0));
    provide(HttpClientForceScrollPreservation, true);
    provide(HttpClientForceNested, true);
    provide(StateHistoryInjectionKey, {
      historyPushState() {
      },
      historyReplaceState() {
      }
    });
    return () => {
      return h(RouterNestedViewComponent, { action: props.action }, slots);
    };
  }
});
const RouterFrameComponent = defineComponent({
  inheritAttrs: false,
  name: "RouterFrame",
  props: {
    src: { type: String, required: true }
  },
  slots: Object,
  setup(props, { slots }) {
    const resolver = useViewResolver();
    const abilities = inject(StateAbilities);
    const authenticated = inject(StateAuthenticated);
    const shared = inject(StateShared);
    const errors = inject(StateErrorsInjectionKey);
    const toasts = inject(ToastRegistryInjectionKey);
    const stack2 = inject(StackedViewInjectionKey);
    const loading = ref(true);
    const view = ref(void 0);
    provide(HttpClientForceScrollPreservation, true);
    provide(HttpClientForceNested, true);
    provide(PreventNestedRouterViewRenderInjectionKey, true);
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
          view.value = updateStack(toRaw$1(toValue(view.value)), response.stack);
        }
        if (response.toasts && response.toasts.length > 0) {
          toasts.value = [...toasts.value, ...response.toasts];
        }
        await nextTick();
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
    onMounted(() => {
      load();
    });
    watch(stack2, () => {
      load();
    }, {
      deep: true
    });
    return () => {
      if (view.value && "component" in view.value) {
        let component = resolver(view.value.component);
        let viewProps = view.value.props;
        component.inheritAttrs = !!component.inheritAttrs;
        return h(component, viewProps);
      }
      if (slots.default) {
        return slots.default();
      }
    };
  }
});
const ToastControllerComponent = defineComponent({
  name: "ToastController",
  slots: Object,
  // _props is a hack to avoid TS error on unused parameter as it is not used
  // at the moment it will throw a TS error, but it has to be passed to read
  // slots and attrs. Remember _ in front whenever you will actually have to
  // use the props. https://github.com/microsoft/TypeScript/issues/9458
  setup(_props, { slots, attrs }) {
    const toasts = useToasts();
    return () => h("div", attrs, slots.default({ toasts: toasts.value }));
  }
});
const ToastComponent = defineComponent({
  name: "Toast",
  props: {
    toast: { type: Object, required: true }
  },
  slots: Object,
  setup(props, { slots, attrs }) {
    const toasts = useToasts();
    const timeout = ref();
    function close() {
      clearTimeout(timeout.value);
      toasts.value = toasts.value.filter((toast) => toast.id !== props.toast.id);
    }
    onMounted(() => {
      timeout.value = setTimeout(() => close(), props.toast.duration * 1e3);
    });
    onBeforeUnmount(() => {
      clearTimeout(timeout.value);
    });
    return () => h("li", attrs, slots.default({ toast: props.toast, close }));
  }
});
const PasswordConfirmationControllerComponent = defineComponent({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: true }
  },
  slots: Object,
  setup(props, { slots, attrs }) {
    const http = useHttpClient();
    const original = ref();
    const open = ref(false);
    function onPasswordConfirm(event) {
      original.value = event;
      open.value = true;
    }
    async function submit(data) {
      let { method, url: url2, options } = original.value;
      return await http.post(props.action, data).then(async () => {
        return await http.dispatch(method, url2, options).then(async (res) => {
          cancel();
          return await nextTick(() => res);
        });
      });
    }
    function cancel() {
      open.value = false;
      original.value = void 0;
    }
    onMounted(() => {
      EventBus.addEventListener("password.confirm", onPasswordConfirm);
    });
    onBeforeUnmount(() => {
      EventBus.removeEventListener("password.confirm", onPasswordConfirm);
    });
    return () => h("div", attrs, slots.default({ open: open.value, submit, cancel }));
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
      prev[key] = toRaw$1(params[key]);
    }
    return prev;
  }, {});
  return url(uri, search, hash2, route2.domain);
}
function replaceRouteParameters(route2, params) {
  return route2.params.reduce((uri, param) => {
    let binding = route2.binding[param] || "id";
    let value = toRaw$1(params[param]);
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
/**
* @vue/shared v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = !!(process.env.NODE_ENV !== "production") ? Object.freeze({}) : {};
!!(process.env.NODE_ENV !== "production") ? Object.freeze([]) : [];
const NOOP = () => {
};
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  if (!styles) return "";
  if (isString(styles)) return styles;
  let ret = "";
  for (const key in styles) {
    const value = styles[key];
    if (isString(value) || typeof value === "number") {
      const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isBooleanAttr = /* @__PURE__ */ makeMap(
  specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function isRenderableAttrValue(value) {
  if (value == null) {
    return false;
  }
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index;
  let lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escaped;
  }
  return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function normalizeCssVarValue(value) {
  if (value == null) {
    return "initial";
  }
  if (typeof value === "string") {
    return value === "" ? " " : value;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    if (!!(process.env.NODE_ENV !== "production")) {
      console.warn(
        "[Vue warn] Invalid value used for CSS binding. Expected a string or a finite number but received:",
        value
      );
    }
  }
  return String(value);
}
/**
* @vue/server-renderer v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const shouldIgnoreProp = /* @__PURE__ */ makeMap(
  `,key,ref,innerHTML,textContent,ref_key,ref_for`
);
function ssrRenderAttrs(props, tag) {
  let ret = "";
  for (const key in props) {
    if (shouldIgnoreProp(key) || isOn(key) || tag === "textarea" && key === "value") {
      continue;
    }
    const value = props[key];
    if (key === "class") {
      ret += ` class="${ssrRenderClass(value)}"`;
    } else if (key === "style") {
      ret += ` style="${ssrRenderStyle(value)}"`;
    } else if (key === "className") {
      ret += ` class="${String(value)}"`;
    } else {
      ret += ssrRenderDynamicAttr(key, value, tag);
    }
  }
  return ret;
}
function ssrRenderDynamicAttr(key, value, tag) {
  if (!isRenderableAttrValue(value)) {
    return ``;
  }
  const attrKey = tag && (tag.indexOf("-") > 0 || isSVGTag(tag)) ? key : propsToAttrMap[key] || key.toLowerCase();
  if (isBooleanAttr(attrKey)) {
    return includeBooleanAttr(value) ? ` ${attrKey}` : ``;
  } else if (isSSRSafeAttrName(attrKey)) {
    return value === "" ? ` ${attrKey}` : ` ${attrKey}="${escapeHtml(value)}"`;
  } else {
    console.warn(
      `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${attrKey}`
    );
    return ``;
  }
}
function ssrRenderClass(raw) {
  return escapeHtml(normalizeClass(raw));
}
function ssrRenderStyle(raw) {
  if (!raw) {
    return "";
  }
  if (isString(raw)) {
    return escapeHtml(raw);
  }
  const styles = normalizeStyle(ssrResetCssVars(raw));
  return escapeHtml(stringifyStyle(styles));
}
function ssrResetCssVars(raw) {
  if (!isArray(raw) && isObject(raw)) {
    const res = {};
    for (const key in raw) {
      if (key.startsWith(":--")) {
        res[key.slice(1)] = normalizeCssVarValue(raw[key]);
      } else {
        res[key] = raw[key];
      }
    }
    return res;
  }
  return raw;
}
const { ensureValidVNode } = ssrUtils;
function ssrRenderTeleport(parentPush, contentRenderFn, target, disabled, parentComponent) {
  parentPush("<!--teleport start-->");
  const context = parentComponent.appContext.provides[ssrContextKey];
  const teleportBuffers = context.__teleportBuffers || (context.__teleportBuffers = {});
  const targetBuffer = teleportBuffers[target] || (teleportBuffers[target] = []);
  const bufferIndex = targetBuffer.length;
  let teleportContent;
  if (disabled) {
    contentRenderFn(parentPush);
    teleportContent = `<!--teleport start anchor--><!--teleport anchor-->`;
  } else {
    const { getBuffer, push } = createBuffer();
    push(`<!--teleport start anchor-->`);
    contentRenderFn(push);
    push(`<!--teleport anchor-->`);
    teleportContent = getBuffer();
  }
  targetBuffer.splice(bufferIndex, 0, teleportContent);
  parentPush("<!--teleport end-->");
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
const stack = [];
function pushWarningContext$1(vnode) {
  stack.push(vnode);
}
function popWarningContext$1() {
  stack.pop();
}
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush",
  [15]: "component update",
  [16]: "app unmount cleanup function"
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = !!(process.env.NODE_ENV !== "production") ? ErrorTypeStrings[type] : `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (!!(process.env.NODE_ENV !== "production")) {
    const info = ErrorTypeStrings[type];
    if (contextVNode) {
      pushWarningContext$1(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext$1();
    }
    if (throwInDev) {
      throw err;
    } else {
      console.error(err);
    }
  } else if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
let devtools;
let buffer = [];
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    // eslint-disable-next-line no-restricted-syntax
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        buffer = [];
      }
    }, 3e3);
  } else {
    buffer = [];
  }
}
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => v
  );
  registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => v
  );
}
!!(process.env.NODE_ENV !== "production") ? {} : {};
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
!!(process.env.NODE_ENV !== "production") ? warn$1 : NOOP;
!!(process.env.NODE_ENV !== "production") || true ? devtools : void 0;
!!(process.env.NODE_ENV !== "production") || true ? setDevtoolsHook : NOOP;
function ssrCompile(template, instance) {
  {
    throw new Error(
      `On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions.`
    );
  }
}
const {
  createComponentInstance,
  setCurrentRenderingInstance,
  setupComponent,
  renderComponentRoot,
  normalizeVNode,
  pushWarningContext,
  popWarningContext
} = ssrUtils;
function createBuffer() {
  let appendable = false;
  const buffer2 = [];
  return {
    getBuffer() {
      return buffer2;
    },
    push(item) {
      const isStringItem = isString(item);
      if (appendable && isStringItem) {
        buffer2[buffer2.length - 1] += item;
        return;
      }
      buffer2.push(item);
      appendable = isStringItem;
      if (isPromise(item) || isArray(item) && item.hasAsync) {
        buffer2.hasAsync = true;
      }
    }
  };
}
function renderComponentVNode(vnode, parentComponent = null, slotScopeId) {
  const instance = vnode.component = createComponentInstance(
    vnode,
    parentComponent,
    null
  );
  if (!!(process.env.NODE_ENV !== "production")) pushWarningContext(vnode);
  const res = setupComponent(
    instance,
    true
    /* isSSR */
  );
  if (!!(process.env.NODE_ENV !== "production")) popWarningContext();
  const hasAsyncSetup = isPromise(res);
  let prefetches = instance.sp;
  if (hasAsyncSetup || prefetches) {
    const p = Promise.resolve(res).then(() => {
      if (hasAsyncSetup) prefetches = instance.sp;
      if (prefetches) {
        return Promise.all(
          prefetches.map((prefetch) => prefetch.call(instance.proxy))
        );
      }
    }).catch(NOOP);
    return p.then(() => renderComponentSubTree(instance, slotScopeId));
  } else {
    return renderComponentSubTree(instance, slotScopeId);
  }
}
function renderComponentSubTree(instance, slotScopeId) {
  if (!!(process.env.NODE_ENV !== "production")) pushWarningContext(instance.vnode);
  const comp = instance.type;
  const { getBuffer, push } = createBuffer();
  if (isFunction(comp)) {
    let root = renderComponentRoot(instance);
    if (!comp.props) {
      for (const key in instance.attrs) {
        if (key.startsWith(`data-v-`)) {
          (root.props || (root.props = {}))[key] = ``;
        }
      }
    }
    renderVNode(push, instance.subTree = root, instance, slotScopeId);
  } else {
    if ((!instance.render || instance.render === NOOP) && !instance.ssrRender && !comp.ssrRender && isString(comp.template)) {
      comp.ssrRender = ssrCompile(comp.template);
    }
    const ssrRender = instance.ssrRender || comp.ssrRender;
    if (ssrRender) {
      let attrs = instance.inheritAttrs !== false ? instance.attrs : void 0;
      let hasCloned = false;
      let cur = instance;
      while (true) {
        const scopeId = cur.vnode.scopeId;
        if (scopeId) {
          if (!hasCloned) {
            attrs = { ...attrs };
            hasCloned = true;
          }
          attrs[scopeId] = "";
        }
        const parent = cur.parent;
        if (parent && parent.subTree && parent.subTree === cur.vnode) {
          cur = parent;
        } else {
          break;
        }
      }
      if (slotScopeId) {
        if (!hasCloned) attrs = { ...attrs };
        const slotScopeIdList = slotScopeId.trim().split(" ");
        for (let i = 0; i < slotScopeIdList.length; i++) {
          attrs[slotScopeIdList[i]] = "";
        }
      }
      const prev = setCurrentRenderingInstance(instance);
      try {
        ssrRender(
          instance.proxy,
          push,
          instance,
          attrs,
          // compiler-optimized bindings
          instance.props,
          instance.setupState,
          instance.data,
          instance.ctx
        );
      } finally {
        setCurrentRenderingInstance(prev);
      }
    } else if (instance.render && instance.render !== NOOP) {
      renderVNode(
        push,
        instance.subTree = renderComponentRoot(instance),
        instance,
        slotScopeId
      );
    } else {
      const componentName = comp.name || comp.__file || `<Anonymous>`;
      warn(`Component ${componentName} is missing template or render function.`);
      push(`<!---->`);
    }
  }
  if (!!(process.env.NODE_ENV !== "production")) popWarningContext();
  return getBuffer();
}
function renderVNode(push, vnode, parentComponent, slotScopeId) {
  const { type, shapeFlag, children, dirs, props } = vnode;
  if (dirs) {
    vnode.props = applySSRDirectives(vnode, props, dirs);
  }
  switch (type) {
    case Text:
      push(escapeHtml(children));
      break;
    case Comment:
      push(
        children ? `<!--${escapeHtmlComment(children)}-->` : `<!---->`
      );
      break;
    case Static:
      push(children);
      break;
    case Fragment:
      if (vnode.slotScopeIds) {
        slotScopeId = (slotScopeId ? slotScopeId + " " : "") + vnode.slotScopeIds.join(" ");
      }
      push(`<!--[-->`);
      renderVNodeChildren(
        push,
        children,
        parentComponent,
        slotScopeId
      );
      push(`<!--]-->`);
      break;
    default:
      if (shapeFlag & 1) {
        renderElementVNode(push, vnode, parentComponent, slotScopeId);
      } else if (shapeFlag & 6) {
        push(renderComponentVNode(vnode, parentComponent, slotScopeId));
      } else if (shapeFlag & 64) {
        renderTeleportVNode(push, vnode, parentComponent, slotScopeId);
      } else if (shapeFlag & 128) {
        renderVNode(push, vnode.ssContent, parentComponent, slotScopeId);
      } else {
        warn(
          "[@vue/server-renderer] Invalid VNode type:",
          type,
          `(${typeof type})`
        );
      }
  }
}
function renderVNodeChildren(push, children, parentComponent, slotScopeId) {
  for (let i = 0; i < children.length; i++) {
    renderVNode(push, normalizeVNode(children[i]), parentComponent, slotScopeId);
  }
}
function renderElementVNode(push, vnode, parentComponent, slotScopeId) {
  const tag = vnode.type;
  let { props, children, shapeFlag, scopeId } = vnode;
  let openTag = `<${tag}`;
  if (props) {
    openTag += ssrRenderAttrs(props, tag);
  }
  if (scopeId) {
    openTag += ` ${scopeId}`;
  }
  let curParent = parentComponent;
  let curVnode = vnode;
  while (curParent && curVnode === curParent.subTree) {
    curVnode = curParent.vnode;
    if (curVnode.scopeId) {
      openTag += ` ${curVnode.scopeId}`;
    }
    curParent = curParent.parent;
  }
  if (slotScopeId) {
    openTag += ` ${slotScopeId}`;
  }
  push(openTag + `>`);
  if (!isVoidTag(tag)) {
    let hasChildrenOverride = false;
    if (props) {
      if (props.innerHTML) {
        hasChildrenOverride = true;
        push(props.innerHTML);
      } else if (props.textContent) {
        hasChildrenOverride = true;
        push(escapeHtml(props.textContent));
      } else if (tag === "textarea" && props.value) {
        hasChildrenOverride = true;
        push(escapeHtml(props.value));
      }
    }
    if (!hasChildrenOverride) {
      if (shapeFlag & 8) {
        push(escapeHtml(children));
      } else if (shapeFlag & 16) {
        renderVNodeChildren(
          push,
          children,
          parentComponent,
          slotScopeId
        );
      }
    }
    push(`</${tag}>`);
  }
}
function applySSRDirectives(vnode, rawProps, dirs) {
  const toMerge = [];
  for (let i = 0; i < dirs.length; i++) {
    const binding = dirs[i];
    const {
      dir: { getSSRProps }
    } = binding;
    if (getSSRProps) {
      const props = getSSRProps(binding, vnode);
      if (props) toMerge.push(props);
    }
  }
  return mergeProps(rawProps || {}, ...toMerge);
}
function renderTeleportVNode(push, vnode, parentComponent, slotScopeId) {
  const target = vnode.props && vnode.props.to;
  const disabled = vnode.props && vnode.props.disabled;
  if (!target) {
    if (!disabled) {
      warn(`[@vue/server-renderer] Teleport is missing target prop.`);
    }
    return [];
  }
  if (!isString(target)) {
    warn(
      `[@vue/server-renderer] Teleport target must be a query selector string.`
    );
    return [];
  }
  ssrRenderTeleport(
    push,
    (push2) => {
      renderVNodeChildren(
        push2,
        vnode.children,
        parentComponent,
        slotScopeId
      );
    },
    target,
    disabled || disabled === "",
    parentComponent
  );
}
const { isVNode: isVNode$1 } = ssrUtils;
function nestedUnrollBuffer(buffer2, parentRet, startIndex) {
  if (!buffer2.hasAsync) {
    return parentRet + unrollBufferSync$1(buffer2);
  }
  let ret = parentRet;
  for (let i = startIndex; i < buffer2.length; i += 1) {
    const item = buffer2[i];
    if (isString(item)) {
      ret += item;
      continue;
    }
    if (isPromise(item)) {
      return item.then((nestedItem) => {
        buffer2[i] = nestedItem;
        return nestedUnrollBuffer(buffer2, ret, i);
      });
    }
    const result = nestedUnrollBuffer(item, ret, 0);
    if (isPromise(result)) {
      return result.then((nestedItem) => {
        buffer2[i] = nestedItem;
        return nestedUnrollBuffer(buffer2, "", i);
      });
    }
    ret = result;
  }
  return ret;
}
function unrollBuffer$1(buffer2) {
  return nestedUnrollBuffer(buffer2, "", 0);
}
function unrollBufferSync$1(buffer2) {
  let ret = "";
  for (let i = 0; i < buffer2.length; i++) {
    let item = buffer2[i];
    if (isString(item)) {
      ret += item;
    } else {
      ret += unrollBufferSync$1(item);
    }
  }
  return ret;
}
async function renderToString(input, context = {}) {
  if (isVNode$1(input)) {
    return renderToString(createApp({ render: () => input }), context);
  }
  const vnode = createVNode(input._component, input._props);
  vnode.appContext = input._context;
  input.provide(ssrContextKey, context);
  const buffer2 = await renderComponentVNode(vnode);
  const result = await unrollBuffer$1(buffer2);
  await resolveTeleports(context);
  if (context.__watcherHandles) {
    for (const unwatch of context.__watcherHandles) {
      unwatch();
    }
  }
  return result;
}
async function resolveTeleports(context) {
  if (context.__teleportBuffers) {
    context.teleports = context.teleports || {};
    for (const key in context.__teleportBuffers) {
      context.teleports[key] = await unrollBuffer$1(
        await Promise.all([context.__teleportBuffers[key]])
      );
    }
  }
}
const { isVNode } = ssrUtils;
initDirectivesForSSR();
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
const RouterComponent = defineComponent({
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
    const abilities = ref(props.state.abilities);
    const errors = ref(props.state.errors);
    const meta = ref(props.state.meta);
    const shared = ref(props.state.shared || {});
    const authenticated = ref(props.state.authenticated);
    const location = ref(props.state.location);
    const stack2 = ref(props.state.stack);
    const signature = ref(props.state.signature);
    const toasts = ref(props.state.toasts);
    function buildState() {
      return {
        meta: toRaw$1(toValue(meta)),
        location: toRaw$1(toValue(location)),
        signature: toRaw$1(toValue(signature)),
        stack: toRaw$1(toValue(stack2))
      };
    }
    async function update(fresh) {
      return await nextTick(async () => {
        abilities.value = { ...abilities.value, ...fresh.abilities };
        authenticated.value = fresh.authenticated;
        errors.value = fresh.errors;
        if (fresh.meta) meta.value = updateHead(fresh.meta);
        if (fresh.stack) stack2.value = updateStack(toRaw$1(toValue(stack2.value)), fresh.stack);
        if (fresh.location) location.value = fresh.location;
        if (fresh.signature) signature.value = fresh.signature;
        return await nextTick(() => {
          if (fresh.shared) shared.value = { ...shared.value, ...fresh.shared };
          if (fresh.toasts && fresh.toasts.length > 0) toasts.value = [...toasts.value, ...fresh.toasts];
          return buildState();
        });
      });
    }
    provide(StateAbilities, abilities);
    provide(StateAuthenticated, authenticated);
    provide(StateShared, shared);
    provide(StateLocationInjectionKey, location);
    provide(StateStackSignatureInjectionKey, signature);
    provide(StateErrorsInjectionKey, errors);
    provide(StateManagerInjectionKey, update);
    provide(StackedViewResolverInjectionKey, props.resolver);
    provide(StackedViewDepthInjectionKey, computed(() => 0));
    provide(StackedViewInjectionKey, stack2);
    provide(ToastRegistryInjectionKey, toasts);
    provide(StateHistoryInjectionKey, {
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
        stack2.value = event.state.stack;
        signature.value = event.state.signature;
      } else {
        window.history.replaceState(buildState(), "", location.value);
        document.body.scroll({ behavior: "instant", left: 0, top: 0 });
      }
    }
    onMounted(() => {
      window.history.replaceState(buildState(), "", location.value);
      window.addEventListener("popstate", handlePopStateEvent);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("popstate", handlePopStateEvent);
    });
    return () => {
      return h(RouterViewComponent);
    };
  }
});
async function createFoundationController({ initial, resolver, setup }) {
  const isServer = typeof window === "undefined";
  const state = initial || readInitialState();
  const app = setup({ router: RouterComponent, props: { resolver, state } });
  if (isServer) {
    return await renderToString(app);
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
const confirmation = ref();
async function createConfirmation(config, callback) {
  return new Promise((resolve, reject) => {
    function confirm() {
      confirmation.value.processing = true;
      nextTick(() => {
        Promise.resolve(callback()).then((value) => {
          confirmation.value = void 0;
          nextTick(() => resolve(value));
        }).catch((error) => {
          confirmation.value = void 0;
          nextTick(() => reject(error));
        });
      });
    }
    function cancel() {
      confirmation.value = void 0;
      nextTick(() => reject());
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
  return ref();
}
function useFormContext() {
  return inject(FormContextInjectionKey, null);
}
function usePersistentFormContext() {
  let context = inject(FormContextInjectionKey);
  if (!context) {
    throw new Error("Accessing form outside of context.");
  }
  return context;
}
function useViewLocation() {
  const view = inject(StackedViewLocationInjectionKey);
  if (!view) {
    throw new Error("You're trying to get stacked view parent out of Router context!");
  }
  return view;
}
function useViewParent() {
  const view = inject(StackedViewParentInjectionKey);
  if (!view) {
    throw new Error("You're trying to get parent view out of Router context!");
  }
  return view;
}
function useViewParentLocation() {
  const parent = useViewParent();
  return computed(() => {
    if (parent && parent.value && parent.value.location) {
      return url(parent.value.location, parent.value.query);
    }
  });
}
function useViewQuery() {
  const view = inject(StackedViewQueryInjectionKey);
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
export {
  CompleteResponse,
  ErrorModal,
  EventBus,
  FormContextInjectionKey,
  FormControllerComponent,
  HttpClientForceNested,
  HttpClientForceScrollPreservation,
  HttpClientScrollHandler,
  PreventNestedRouterViewRenderInjectionKey,
  Request,
  Response,
  RouterComponent,
  RouterFrameComponent,
  RouterLinkComponent,
  RouterNestedComponent,
  RouterViewComponent,
  StackedViewDepthInjectionKey,
  StackedViewInjectionKey,
  StackedViewLayoutInjectionKey,
  StackedViewLocationInjectionKey,
  StackedViewParentInjectionKey,
  StackedViewQueryInjectionKey,
  StackedViewResolverInjectionKey,
  StateAbilities,
  StateAuthenticated,
  StateErrorsInjectionKey,
  StateHistoryInjectionKey,
  StateLocationInjectionKey,
  StateManagerInjectionKey,
  StateShared,
  StateStackSignatureInjectionKey,
  ToastComponent,
  ToastControllerComponent,
  ToastKind,
  ToastRegistryInjectionKey,
  blank,
  createFormContext,
  createFoundationController,
  createOtherSoftwareFoundation,
  filled,
  findScrollParent,
  getModelFromContext,
  groupBy,
  hash,
  isCountryExplicit,
  isCountryImplicit,
  isNestedRouterViewPrevented,
  nestedSetAncestors,
  nestedSetChildren,
  nestedSetDescendants,
  nestedSetRoot,
  random,
  route,
  setModelWithContext,
  trans,
  transChoice,
  updateStack,
  url,
  useAbilities,
  useAuthenticated,
  useConfirmation,
  useCurrentConfirmation,
  useErrors,
  useFormApi,
  useFormContext,
  useHttpClient,
  useLocation,
  usePersistentFormContext,
  useShared,
  useStackLayout,
  useStackSignature,
  useStateHistory,
  useStateManager,
  useToasts,
  useViewDepth,
  useViewLocation,
  useViewParent,
  useViewParentLocation,
  useViewQuery,
  useViewResolver,
  useViewStack,
  wrap
};
//# sourceMappingURL=other-software-foundation.js.map

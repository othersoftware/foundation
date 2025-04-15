var Xn = Object.defineProperty;
var Zn = (e, t, n) => t in e ? Xn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var x = (e, t, n) => Zn(e, typeof t != "symbol" ? t + "" : t, n);
import { inject as P, ref as R, defineComponent as pe, toValue as F, computed as H, watch as gr, provide as O, h as oe, nextTick as ne, onMounted as Tt, onBeforeUnmount as Ut, toRaw as X, ssrUtils as xt, initDirectivesForSSR as Qn, createApp as eo, createVNode as to, ssrContextKey as Tr, warn as wt, Fragment as ro, Static as no, Comment as oo, Text as so, mergeProps as ao } from "vue";
class Bt {
  constructor(t) {
    x(this, "xhr");
    x(this, "status");
    x(this, "success");
    x(this, "fail");
    x(this, "partial");
    x(this, "raw");
    x(this, "message");
    x(this, "content");
    if (this.xhr = t, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
  }
}
class St extends Bt {
  constructor(n) {
    super(n);
    x(this, "abilities");
    x(this, "authenticated");
    x(this, "location");
    x(this, "signature");
    x(this, "redirect");
    x(this, "stack");
    x(this, "toasts");
    x(this, "errors");
    let o = JSON.parse(this.xhr.response);
    this.abilities = o.abilities, this.authenticated = o.authenticated, this.location = o.location, this.signature = o.signature, this.redirect = o.redirect, this.stack = o.stack, this.errors = o.errors, this.toasts = o.toasts;
  }
}
const Wt = Symbol("StateLocation"), zt = Symbol("StateStackSignature"), vt = Symbol("StateAuthenticated"), Yt = Symbol("StateAbilities"), Jt = Symbol("StateManager"), Xt = Symbol("StateHistory");
function Zs() {
  let e = P(Yt);
  if (!e)
    throw new Error("Abilities are used out of router context!");
  return e;
}
function Qs() {
  let e = P(vt);
  if (!e)
    throw new Error("Authenticated is used out of router context!");
  return e;
}
function xr() {
  let e = P(Wt);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function io() {
  let e = P(zt);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function co() {
  let e = P(Jt);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function uo() {
  let e = P(Xt);
  if (!e)
    throw new Error("State history is used out of router context!");
  return e;
}
function Zt(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Zt(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class Qt {
  constructor(t, n, o = void 0, s = void 0, i = !1, d = void 0) {
    x(this, "method");
    x(this, "url");
    x(this, "xhr");
    x(this, "body");
    x(this, "signature");
    x(this, "refreshStack");
    x(this, "referer");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = n, this.body = o, this.signature = s, this.refreshStack = i, this.referer = d;
  }
  static send(t, n, o = void 0, s = void 0, i = !1, d = void 0) {
    return new Qt(t, n, o, s, i, d).send();
  }
  send() {
    return new Promise((t, n) => {
      this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.referer && this.xhr.setRequestHeader("X-Stack-Referer", this.referer), this.refreshStack && this.xhr.setRequestHeader("X-Stack-Refresh", "true"), this.signature && this.xhr.setRequestHeader("X-Stack-Signature", this.signature), this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? n(new St(this.xhr)) : n(new Bt(this.xhr)) : t(new St(this.xhr)));
      }, this.xhr.onerror = () => {
        n(new Bt(this.xhr));
      }, this.xhr.send(this.transform(this.body));
    });
  }
  transform(t) {
    return t instanceof Blob || t instanceof ArrayBuffer || t instanceof FormData || t instanceof URLSearchParams || typeof t == "string" ? t : t === null ? null : (this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), JSON.stringify(t));
  }
  readCookie(t) {
    const n = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
    return n ? decodeURIComponent(n[3]) : "";
  }
}
const lo = {
  modal: void 0,
  listener: void 0,
  show(e) {
    typeof e == "object" && (e = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(e)}`);
    const t = document.createElement("html");
    t.innerHTML = e, t.querySelectorAll("a").forEach((o) => o.setAttribute("target", "_top")), this.modal = document.createElement("dialog"), this.modal.style.display = "flex", this.modal.style.width = "100%", this.modal.style.height = "100dvh", this.modal.style.maxWidth = "100%", this.modal.style.maxHeight = "100dvh", this.modal.style.padding = "2rem", this.modal.style.boxSizing = "border-box", this.modal.style.border = "none", this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)", this.modal.style.backdropFilter = "blur(0.125rem)", this.modal.addEventListener("click", () => this.hide());
    const n = document.createElement("iframe");
    if (n.style.backgroundColor = "white", n.style.borderRadius = "0.5rem", n.style.border = "none", n.style.width = "100%", n.style.height = "100%", this.modal.appendChild(n), document.body.prepend(this.modal), document.body.style.overflow = "hidden", !n.contentWindow)
      throw new Error("iframe not yet ready.");
    n.contentWindow.document.open(), n.contentWindow.document.write(t.outerHTML), n.contentWindow.document.close(), this.listener = this.hideOnEscape.bind(this), this.modal.showModal(), document.addEventListener("keydown", this.listener);
  },
  hide() {
    this.modal.outerHTML = "", this.modal = void 0, document.body.style.overflow = "visible", document.removeEventListener("keydown", this.listener);
  },
  hideOnEscape(e) {
    e.key === "Escape" && this.hide();
  }
}, re = {}, Kt = {
  addEventListener(e, t) {
    re[e] ? re[e].push(t) : re[e] = [t];
  },
  removeEventListener(e, t) {
    re[e] && (re[e] = re[e].filter((n) => n !== t), re[e].length === 0 && delete re[e]);
  },
  dispatch(e, t) {
    return re[e] && re[e].forEach((n) => n(t)), t;
  }
}, Rr = Symbol("HttpClientForceScrollPreservation");
function Rt() {
  const e = co(), t = io(), n = uo(), o = xr(), s = P(Rr, !1);
  async function i(_, S, { data: p = void 0, preserveScroll: v = !1, replace: E = !1, refreshStack: I = !1 } = {}) {
    return document.body.classList.add("osf-loading"), await Qt.send(_, S, p, t.value, I, o.value).then(async (b) => await e.update(b).then((N) => b.redirect ? g(b.redirect) : b.raw ? Promise.resolve(b.raw) : (!s && !v && d(), E ? n.historyReplaceState(N) : n.historyPushState(N), Promise.resolve(b)))).catch(async (b) => b instanceof St ? await e.update(b).then(() => Promise.reject(b)) : b.status === 423 ? (Kt.dispatch("password.confirm", { method: _, url: S, options: { data: p, preserveScroll: v, replace: E } }), Promise.reject(b)) : (console.error(b), APP_DEBUG && b.content && lo.show(b.content), Promise.reject(b))).finally(() => {
      document.body.classList.remove("osf-loading");
    });
  }
  function d() {
    window.scroll(0, 0);
  }
  async function g(_) {
    return _.reload ? await new Promise(() => {
      window.location.href = _.target;
    }) : await i("GET", _.target, {
      preserveScroll: !0,
      replace: !1,
      refreshStack: !0
    });
  }
  return {
    dispatch: i,
    get: async function(_) {
      return await i("GET", _);
    },
    post: async function(_, S = void 0) {
      return await i("POST", _, { data: S, preserveScroll: !0 });
    },
    patch: async function(_, S = void 0) {
      return await i("PATCH", _, { data: S, preserveScroll: !0 });
    },
    put: async function(_, S = void 0) {
      return await i("PUT", _, { data: S, preserveScroll: !0 });
    },
    delete: async function(_, S = void 0) {
      return await i("DELETE", _, { data: S, preserveScroll: !0 });
    }
  };
}
var B = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function er(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vt, yr;
function fo() {
  if (yr) return Vt;
  yr = 1;
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = 9007199254740991, o = "[object Function]", s = "[object GeneratorFunction]", i = "[object Symbol]", d = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, g = /^\w*$/, _ = /^\./, S = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, p = /[\\^$.*+?()[\]{}|]/g, v = /\\(\\)?/g, E = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, b = typeof B == "object" && B && B.Object === Object && B, N = typeof self == "object" && self && self.Object === Object && self, G = b || N || Function("return this")();
  function _e(a, l) {
    return a == null ? void 0 : a[l];
  }
  function Ve(a) {
    var l = !1;
    if (a != null && typeof a.toString != "function")
      try {
        l = !!(a + "");
      } catch {
      }
    return l;
  }
  var Oe = Array.prototype, se = Function.prototype, ge = Object.prototype, q = G["__core-js_shared__"], ae = function() {
    var a = /[^.]+$/.exec(q && q.keys && q.keys.IE_PROTO || "");
    return a ? "Symbol(src)_1." + a : "";
  }(), ye = se.toString, ie = ge.hasOwnProperty, me = ge.toString, De = RegExp(
    "^" + ye.call(ie).replace(p, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Te = G.Symbol, Z = Oe.splice, xe = Ne(G, "Map"), U = Ne(Object, "create"), V = Te ? Te.prototype : void 0, Me = V ? V.toString : void 0;
  function W(a) {
    var l = -1, y = a ? a.length : 0;
    for (this.clear(); ++l < y; ) {
      var T = a[l];
      this.set(T[0], T[1]);
    }
  }
  function rt() {
    this.__data__ = U ? U(null) : {};
  }
  function A(a) {
    return this.has(a) && delete this.__data__[a];
  }
  function nt(a) {
    var l = this.__data__;
    if (U) {
      var y = l[a];
      return y === t ? void 0 : y;
    }
    return ie.call(l, a) ? l[a] : void 0;
  }
  function Q(a) {
    var l = this.__data__;
    return U ? l[a] !== void 0 : ie.call(l, a);
  }
  function $(a, l) {
    var y = this.__data__;
    return y[a] = U && l === void 0 ? t : l, this;
  }
  W.prototype.clear = rt, W.prototype.delete = A, W.prototype.get = nt, W.prototype.has = Q, W.prototype.set = $;
  function z(a) {
    var l = -1, y = a ? a.length : 0;
    for (this.clear(); ++l < y; ) {
      var T = a[l];
      this.set(T[0], T[1]);
    }
  }
  function Fe() {
    this.__data__ = [];
  }
  function ot(a) {
    var l = this.__data__, y = ue(l, a);
    if (y < 0)
      return !1;
    var T = l.length - 1;
    return y == T ? l.pop() : Z.call(l, y, 1), !0;
  }
  function st(a) {
    var l = this.__data__, y = ue(l, a);
    return y < 0 ? void 0 : l[y][1];
  }
  function Y(a) {
    return ue(this.__data__, a) > -1;
  }
  function at(a, l) {
    var y = this.__data__, T = ue(y, a);
    return T < 0 ? y.push([a, l]) : y[T][1] = l, this;
  }
  z.prototype.clear = Fe, z.prototype.delete = ot, z.prototype.get = st, z.prototype.has = Y, z.prototype.set = at;
  function J(a) {
    var l = -1, y = a ? a.length : 0;
    for (this.clear(); ++l < y; ) {
      var T = a[l];
      this.set(T[0], T[1]);
    }
  }
  function Be() {
    this.__data__ = {
      hash: new W(),
      map: new (xe || z)(),
      string: new W()
    };
  }
  function it(a) {
    return fe(this, a).delete(a);
  }
  function ct(a) {
    return fe(this, a).get(a);
  }
  function ce(a) {
    return fe(this, a).has(a);
  }
  function Ke(a, l) {
    return fe(this, a).set(a, l), this;
  }
  J.prototype.clear = Be, J.prototype.delete = it, J.prototype.get = ct, J.prototype.has = ce, J.prototype.set = Ke;
  function Re(a, l, y) {
    var T = a[l];
    (!(ie.call(a, l) && qe(T, y)) || y === void 0 && !(l in a)) && (a[l] = y);
  }
  function ue(a, l) {
    for (var y = a.length; y--; )
      if (qe(a[y][0], l))
        return y;
    return -1;
  }
  function ut(a) {
    if (!Ce(a) || ve(a))
      return !1;
    var l = Ue(a) || Ve(a) ? De : E;
    return l.test(ft(a));
  }
  function we(a, l, y, T) {
    if (!Ce(a))
      return a;
    l = Se(l, a) ? [l] : Pe(l);
    for (var M = -1, ee = l.length, We = ee - 1, Ie = a; Ie != null && ++M < ee; ) {
      var ze = Le(l[M]), je = y;
      if (M != We) {
        var te = Ie[ze];
        je = void 0, je === void 0 && (je = Ce(te) ? te : D(l[M + 1]) ? [] : {});
      }
      Re(Ie, ze, je), Ie = Ie[ze];
    }
    return a;
  }
  function le(a) {
    if (typeof a == "string")
      return a;
    if (h(a))
      return Me ? Me.call(a) : "";
    var l = a + "";
    return l == "0" && 1 / a == -1 / 0 ? "-0" : l;
  }
  function Pe(a) {
    return Ee(a) ? a : Ge(a);
  }
  function fe(a, l) {
    var y = a.__data__;
    return lt(l) ? y[typeof l == "string" ? "string" : "hash"] : y.map;
  }
  function Ne(a, l) {
    var y = _e(a, l);
    return ut(y) ? y : void 0;
  }
  function D(a, l) {
    return l = l ?? n, !!l && (typeof a == "number" || I.test(a)) && a > -1 && a % 1 == 0 && a < l;
  }
  function Se(a, l) {
    if (Ee(a))
      return !1;
    var y = typeof a;
    return y == "number" || y == "symbol" || y == "boolean" || a == null || h(a) ? !0 : g.test(a) || !d.test(a) || l != null && a in Object(l);
  }
  function lt(a) {
    var l = typeof a;
    return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? a !== "__proto__" : a === null;
  }
  function ve(a) {
    return !!ae && ae in a;
  }
  var Ge = be(function(a) {
    a = m(a);
    var l = [];
    return _.test(a) && l.push(""), a.replace(S, function(y, T, M, ee) {
      l.push(M ? ee.replace(v, "$1") : T || y);
    }), l;
  });
  function Le(a) {
    if (typeof a == "string" || h(a))
      return a;
    var l = a + "";
    return l == "0" && 1 / a == -1 / 0 ? "-0" : l;
  }
  function ft(a) {
    if (a != null) {
      try {
        return ye.call(a);
      } catch {
      }
      try {
        return a + "";
      } catch {
      }
    }
    return "";
  }
  function be(a, l) {
    if (typeof a != "function" || l && typeof l != "function")
      throw new TypeError(e);
    var y = function() {
      var T = arguments, M = l ? l.apply(this, T) : T[0], ee = y.cache;
      if (ee.has(M))
        return ee.get(M);
      var We = a.apply(this, T);
      return y.cache = ee.set(M, We), We;
    };
    return y.cache = new (be.Cache || J)(), y;
  }
  be.Cache = J;
  function qe(a, l) {
    return a === l || a !== a && l !== l;
  }
  var Ee = Array.isArray;
  function Ue(a) {
    var l = Ce(a) ? me.call(a) : "";
    return l == o || l == s;
  }
  function Ce(a) {
    var l = typeof a;
    return !!a && (l == "object" || l == "function");
  }
  function u(a) {
    return !!a && typeof a == "object";
  }
  function h(a) {
    return typeof a == "symbol" || u(a) && me.call(a) == i;
  }
  function m(a) {
    return a == null ? "" : le(a);
  }
  function C(a, l, y) {
    return a == null ? a : we(a, l, y);
  }
  return Vt = C, Vt;
}
var ho = fo();
const mr = /* @__PURE__ */ er(ho);
var Dt, wr;
function po() {
  if (wr) return Dt;
  wr = 1;
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = "[object Function]", o = "[object GeneratorFunction]", s = "[object Symbol]", i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, d = /^\w*$/, g = /^\./, _ = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, S = /[\\^$.*+?()[\]{}|]/g, p = /\\(\\)?/g, v = /^\[object .+?Constructor\]$/, E = typeof B == "object" && B && B.Object === Object && B, I = typeof self == "object" && self && self.Object === Object && self, b = E || I || Function("return this")();
  function N(u, h) {
    return u == null ? void 0 : u[h];
  }
  function G(u) {
    var h = !1;
    if (u != null && typeof u.toString != "function")
      try {
        h = !!(u + "");
      } catch {
      }
    return h;
  }
  var _e = Array.prototype, Ve = Function.prototype, Oe = Object.prototype, se = b["__core-js_shared__"], ge = function() {
    var u = /[^.]+$/.exec(se && se.keys && se.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), q = Ve.toString, ae = Oe.hasOwnProperty, ye = Oe.toString, ie = RegExp(
    "^" + q.call(ae).replace(S, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), me = b.Symbol, De = _e.splice, Te = le(b, "Map"), Z = le(Object, "create"), xe = me ? me.prototype : void 0, U = xe ? xe.toString : void 0;
  function V(u) {
    var h = -1, m = u ? u.length : 0;
    for (this.clear(); ++h < m; ) {
      var C = u[h];
      this.set(C[0], C[1]);
    }
  }
  function Me() {
    this.__data__ = Z ? Z(null) : {};
  }
  function W(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function rt(u) {
    var h = this.__data__;
    if (Z) {
      var m = h[u];
      return m === t ? void 0 : m;
    }
    return ae.call(h, u) ? h[u] : void 0;
  }
  function A(u) {
    var h = this.__data__;
    return Z ? h[u] !== void 0 : ae.call(h, u);
  }
  function nt(u, h) {
    var m = this.__data__;
    return m[u] = Z && h === void 0 ? t : h, this;
  }
  V.prototype.clear = Me, V.prototype.delete = W, V.prototype.get = rt, V.prototype.has = A, V.prototype.set = nt;
  function Q(u) {
    var h = -1, m = u ? u.length : 0;
    for (this.clear(); ++h < m; ) {
      var C = u[h];
      this.set(C[0], C[1]);
    }
  }
  function $() {
    this.__data__ = [];
  }
  function z(u) {
    var h = this.__data__, m = ce(h, u);
    if (m < 0)
      return !1;
    var C = h.length - 1;
    return m == C ? h.pop() : De.call(h, m, 1), !0;
  }
  function Fe(u) {
    var h = this.__data__, m = ce(h, u);
    return m < 0 ? void 0 : h[m][1];
  }
  function ot(u) {
    return ce(this.__data__, u) > -1;
  }
  function st(u, h) {
    var m = this.__data__, C = ce(m, u);
    return C < 0 ? m.push([u, h]) : m[C][1] = h, this;
  }
  Q.prototype.clear = $, Q.prototype.delete = z, Q.prototype.get = Fe, Q.prototype.has = ot, Q.prototype.set = st;
  function Y(u) {
    var h = -1, m = u ? u.length : 0;
    for (this.clear(); ++h < m; ) {
      var C = u[h];
      this.set(C[0], C[1]);
    }
  }
  function at() {
    this.__data__ = {
      hash: new V(),
      map: new (Te || Q)(),
      string: new V()
    };
  }
  function J(u) {
    return we(this, u).delete(u);
  }
  function Be(u) {
    return we(this, u).get(u);
  }
  function it(u) {
    return we(this, u).has(u);
  }
  function ct(u, h) {
    return we(this, u).set(u, h), this;
  }
  Y.prototype.clear = at, Y.prototype.delete = J, Y.prototype.get = Be, Y.prototype.has = it, Y.prototype.set = ct;
  function ce(u, h) {
    for (var m = u.length; m--; )
      if (Ge(u[m][0], h))
        return m;
    return -1;
  }
  function Ke(u, h) {
    h = Pe(h, u) ? [h] : ut(h);
    for (var m = 0, C = h.length; u != null && m < C; )
      u = u[Se(h[m++])];
    return m && m == C ? u : void 0;
  }
  function Re(u) {
    if (!be(u) || Ne(u))
      return !1;
    var h = ft(u) || G(u) ? ie : v;
    return h.test(lt(u));
  }
  function ue(u) {
    if (typeof u == "string")
      return u;
    if (Ee(u))
      return U ? U.call(u) : "";
    var h = u + "";
    return h == "0" && 1 / u == -1 / 0 ? "-0" : h;
  }
  function ut(u) {
    return Le(u) ? u : D(u);
  }
  function we(u, h) {
    var m = u.__data__;
    return fe(h) ? m[typeof h == "string" ? "string" : "hash"] : m.map;
  }
  function le(u, h) {
    var m = N(u, h);
    return Re(m) ? m : void 0;
  }
  function Pe(u, h) {
    if (Le(u))
      return !1;
    var m = typeof u;
    return m == "number" || m == "symbol" || m == "boolean" || u == null || Ee(u) ? !0 : d.test(u) || !i.test(u) || h != null && u in Object(h);
  }
  function fe(u) {
    var h = typeof u;
    return h == "string" || h == "number" || h == "symbol" || h == "boolean" ? u !== "__proto__" : u === null;
  }
  function Ne(u) {
    return !!ge && ge in u;
  }
  var D = ve(function(u) {
    u = Ue(u);
    var h = [];
    return g.test(u) && h.push(""), u.replace(_, function(m, C, a, l) {
      h.push(a ? l.replace(p, "$1") : C || m);
    }), h;
  });
  function Se(u) {
    if (typeof u == "string" || Ee(u))
      return u;
    var h = u + "";
    return h == "0" && 1 / u == -1 / 0 ? "-0" : h;
  }
  function lt(u) {
    if (u != null) {
      try {
        return q.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function ve(u, h) {
    if (typeof u != "function" || h && typeof h != "function")
      throw new TypeError(e);
    var m = function() {
      var C = arguments, a = h ? h.apply(this, C) : C[0], l = m.cache;
      if (l.has(a))
        return l.get(a);
      var y = u.apply(this, C);
      return m.cache = l.set(a, y), y;
    };
    return m.cache = new (ve.Cache || Y)(), m;
  }
  ve.Cache = Y;
  function Ge(u, h) {
    return u === h || u !== u && h !== h;
  }
  var Le = Array.isArray;
  function ft(u) {
    var h = be(u) ? ye.call(u) : "";
    return h == n || h == o;
  }
  function be(u) {
    var h = typeof u;
    return !!u && (h == "object" || h == "function");
  }
  function qe(u) {
    return !!u && typeof u == "object";
  }
  function Ee(u) {
    return typeof u == "symbol" || qe(u) && ye.call(u) == s;
  }
  function Ue(u) {
    return u == null ? "" : ue(u);
  }
  function Ce(u, h, m) {
    var C = u == null ? void 0 : Ke(u, h);
    return C === void 0 ? m : C;
  }
  return Dt = Ce, Dt;
}
var _o = po();
const go = /* @__PURE__ */ er(_o), bt = Symbol("FormContext");
function yo(e = {}, t = !1) {
  const n = R(e), o = R({}), s = R({}), i = R(!1), d = R(t);
  function g(p) {
    mr(s.value, p, !0);
  }
  function _(p, v) {
    return go(n.value, p, v);
  }
  function S(p, v) {
    mr(n.value, p, v);
  }
  return {
    data: n,
    errors: o,
    touched: s,
    processing: i,
    readonly: d,
    touch: g,
    value: _,
    fill: S
  };
}
function ea(e, t, n) {
  return e && t && (t.touch(e), t.fill(e, n)), n;
}
function ta(e, t, n) {
  return e && t ? t.value(e, n) : n;
}
var dt = { exports: {} };
dt.exports;
var Sr;
function mo() {
  return Sr || (Sr = 1, function(e, t) {
    var n = 200, o = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", d = "[object Array]", g = "[object Boolean]", _ = "[object Date]", S = "[object Error]", p = "[object Function]", v = "[object GeneratorFunction]", E = "[object Map]", I = "[object Number]", b = "[object Object]", N = "[object Promise]", G = "[object RegExp]", _e = "[object Set]", Ve = "[object String]", Oe = "[object Symbol]", se = "[object WeakMap]", ge = "[object ArrayBuffer]", q = "[object DataView]", ae = "[object Float32Array]", ye = "[object Float64Array]", ie = "[object Int8Array]", me = "[object Int16Array]", De = "[object Int32Array]", Te = "[object Uint8Array]", Z = "[object Uint8ClampedArray]", xe = "[object Uint16Array]", U = "[object Uint32Array]", V = /[\\^$.*+?()[\]{}|]/g, Me = /\w*$/, W = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, A = {};
    A[i] = A[d] = A[ge] = A[q] = A[g] = A[_] = A[ae] = A[ye] = A[ie] = A[me] = A[De] = A[E] = A[I] = A[b] = A[G] = A[_e] = A[Ve] = A[Oe] = A[Te] = A[Z] = A[xe] = A[U] = !0, A[S] = A[p] = A[se] = !1;
    var nt = typeof B == "object" && B && B.Object === Object && B, Q = typeof self == "object" && self && self.Object === Object && self, $ = nt || Q || Function("return this")(), z = t && !t.nodeType && t, Fe = z && !0 && e && !e.nodeType && e, ot = Fe && Fe.exports === z;
    function st(r, c) {
      return r.set(c[0], c[1]), r;
    }
    function Y(r, c) {
      return r.add(c), r;
    }
    function at(r, c) {
      for (var f = -1, w = r ? r.length : 0; ++f < w && c(r[f], f, r) !== !1; )
        ;
      return r;
    }
    function J(r, c) {
      for (var f = -1, w = c.length, L = r.length; ++f < w; )
        r[L + f] = c[f];
      return r;
    }
    function Be(r, c, f, w) {
      for (var L = -1, j = r ? r.length : 0; ++L < j; )
        f = c(f, r[L], L, r);
      return f;
    }
    function it(r, c) {
      for (var f = -1, w = Array(r); ++f < r; )
        w[f] = c(f);
      return w;
    }
    function ct(r, c) {
      return r == null ? void 0 : r[c];
    }
    function ce(r) {
      var c = !1;
      if (r != null && typeof r.toString != "function")
        try {
          c = !!(r + "");
        } catch {
        }
      return c;
    }
    function Ke(r) {
      var c = -1, f = Array(r.size);
      return r.forEach(function(w, L) {
        f[++c] = [L, w];
      }), f;
    }
    function Re(r, c) {
      return function(f) {
        return r(c(f));
      };
    }
    function ue(r) {
      var c = -1, f = Array(r.size);
      return r.forEach(function(w) {
        f[++c] = w;
      }), f;
    }
    var ut = Array.prototype, we = Function.prototype, le = Object.prototype, Pe = $["__core-js_shared__"], fe = function() {
      var r = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "");
      return r ? "Symbol(src)_1." + r : "";
    }(), Ne = we.toString, D = le.hasOwnProperty, Se = le.toString, lt = RegExp(
      "^" + Ne.call(D).replace(V, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), ve = ot ? $.Buffer : void 0, Ge = $.Symbol, Le = $.Uint8Array, ft = Re(Object.getPrototypeOf, Object), be = Object.create, qe = le.propertyIsEnumerable, Ee = ut.splice, Ue = Object.getOwnPropertySymbols, Ce = ve ? ve.isBuffer : void 0, u = Re(Object.keys, Object), h = Xe($, "DataView"), m = Xe($, "Map"), C = Xe($, "Promise"), a = Xe($, "Set"), l = Xe($, "WeakMap"), y = Xe(Object, "create"), T = $e(h), M = $e(m), ee = $e(C), We = $e(a), Ie = $e(l), ze = Ge ? Ge.prototype : void 0, je = ze ? ze.valueOf : void 0;
    function te(r) {
      var c = -1, f = r ? r.length : 0;
      for (this.clear(); ++c < f; ) {
        var w = r[c];
        this.set(w[0], w[1]);
      }
    }
    function Qr() {
      this.__data__ = y ? y(null) : {};
    }
    function en(r) {
      return this.has(r) && delete this.__data__[r];
    }
    function tn(r) {
      var c = this.__data__;
      if (y) {
        var f = c[r];
        return f === o ? void 0 : f;
      }
      return D.call(c, r) ? c[r] : void 0;
    }
    function rn(r) {
      var c = this.__data__;
      return y ? c[r] !== void 0 : D.call(c, r);
    }
    function nn(r, c) {
      var f = this.__data__;
      return f[r] = y && c === void 0 ? o : c, this;
    }
    te.prototype.clear = Qr, te.prototype.delete = en, te.prototype.get = tn, te.prototype.has = rn, te.prototype.set = nn;
    function de(r) {
      var c = -1, f = r ? r.length : 0;
      for (this.clear(); ++c < f; ) {
        var w = r[c];
        this.set(w[0], w[1]);
      }
    }
    function on() {
      this.__data__ = [];
    }
    function sn(r) {
      var c = this.__data__, f = ht(c, r);
      if (f < 0)
        return !1;
      var w = c.length - 1;
      return f == w ? c.pop() : Ee.call(c, f, 1), !0;
    }
    function an(r) {
      var c = this.__data__, f = ht(c, r);
      return f < 0 ? void 0 : c[f][1];
    }
    function cn(r) {
      return ht(this.__data__, r) > -1;
    }
    function un(r, c) {
      var f = this.__data__, w = ht(f, r);
      return w < 0 ? f.push([r, c]) : f[w][1] = c, this;
    }
    de.prototype.clear = on, de.prototype.delete = sn, de.prototype.get = an, de.prototype.has = cn, de.prototype.set = un;
    function Ye(r) {
      var c = -1, f = r ? r.length : 0;
      for (this.clear(); ++c < f; ) {
        var w = r[c];
        this.set(w[0], w[1]);
      }
    }
    function ln() {
      this.__data__ = {
        hash: new te(),
        map: new (m || de)(),
        string: new te()
      };
    }
    function fn(r) {
      return pt(this, r).delete(r);
    }
    function dn(r) {
      return pt(this, r).get(r);
    }
    function hn(r) {
      return pt(this, r).has(r);
    }
    function pn(r, c) {
      return pt(this, r).set(r, c), this;
    }
    Ye.prototype.clear = ln, Ye.prototype.delete = fn, Ye.prototype.get = dn, Ye.prototype.has = hn, Ye.prototype.set = pn;
    function Je(r) {
      this.__data__ = new de(r);
    }
    function _n() {
      this.__data__ = new de();
    }
    function gn(r) {
      return this.__data__.delete(r);
    }
    function yn(r) {
      return this.__data__.get(r);
    }
    function mn(r) {
      return this.__data__.has(r);
    }
    function wn(r, c) {
      var f = this.__data__;
      if (f instanceof de) {
        var w = f.__data__;
        if (!m || w.length < n - 1)
          return w.push([r, c]), this;
        f = this.__data__ = new Ye(w);
      }
      return f.set(r, c), this;
    }
    Je.prototype.clear = _n, Je.prototype.delete = gn, Je.prototype.get = yn, Je.prototype.has = mn, Je.prototype.set = wn;
    function Sn(r, c) {
      var f = kt(r) || Gn(r) ? it(r.length, String) : [], w = f.length, L = !!w;
      for (var j in r)
        D.call(r, j) && !(L && (j == "length" || Mn(j, w))) && f.push(j);
      return f;
    }
    function sr(r, c, f) {
      var w = r[c];
      (!(D.call(r, c) && ur(w, f)) || f === void 0 && !(c in r)) && (r[c] = f);
    }
    function ht(r, c) {
      for (var f = r.length; f--; )
        if (ur(r[f][0], c))
          return f;
      return -1;
    }
    function vn(r, c) {
      return r && ar(c, $t(c), r);
    }
    function It(r, c, f, w, L, j, he) {
      var k;
      if (w && (k = j ? w(r, L, j, he) : w(r)), k !== void 0)
        return k;
      if (!_t(r))
        return r;
      var dr = kt(r);
      if (dr) {
        if (k = Hn(r), !c)
          return jn(r, k);
      } else {
        var Ze = ke(r), hr = Ze == p || Ze == v;
        if (Un(r))
          return Tn(r, c);
        if (Ze == b || Ze == i || hr && !j) {
          if (ce(r))
            return j ? r : {};
          if (k = Vn(hr ? {} : r), !c)
            return kn(r, vn(k, r));
        } else {
          if (!A[Ze])
            return j ? r : {};
          k = Dn(r, Ze, It, c);
        }
      }
      he || (he = new Je());
      var pr = he.get(r);
      if (pr)
        return pr;
      if (he.set(r, k), !dr)
        var _r = f ? $n(r) : $t(r);
      return at(_r || r, function(Ht, gt) {
        _r && (gt = Ht, Ht = r[gt]), sr(k, gt, It(Ht, c, f, w, gt, r, he));
      }), k;
    }
    function bn(r) {
      return _t(r) ? be(r) : {};
    }
    function En(r, c, f) {
      var w = c(r);
      return kt(r) ? w : J(w, f(r));
    }
    function Cn(r) {
      return Se.call(r);
    }
    function An(r) {
      if (!_t(r) || Bn(r))
        return !1;
      var c = fr(r) || ce(r) ? lt : W;
      return c.test($e(r));
    }
    function On(r) {
      if (!cr(r))
        return u(r);
      var c = [];
      for (var f in Object(r))
        D.call(r, f) && f != "constructor" && c.push(f);
      return c;
    }
    function Tn(r, c) {
      if (c)
        return r.slice();
      var f = new r.constructor(r.length);
      return r.copy(f), f;
    }
    function jt(r) {
      var c = new r.constructor(r.byteLength);
      return new Le(c).set(new Le(r)), c;
    }
    function xn(r, c) {
      var f = c ? jt(r.buffer) : r.buffer;
      return new r.constructor(f, r.byteOffset, r.byteLength);
    }
    function Rn(r, c, f) {
      var w = c ? f(Ke(r), !0) : Ke(r);
      return Be(w, st, new r.constructor());
    }
    function Pn(r) {
      var c = new r.constructor(r.source, Me.exec(r));
      return c.lastIndex = r.lastIndex, c;
    }
    function Nn(r, c, f) {
      var w = c ? f(ue(r), !0) : ue(r);
      return Be(w, Y, new r.constructor());
    }
    function Ln(r) {
      return je ? Object(je.call(r)) : {};
    }
    function In(r, c) {
      var f = c ? jt(r.buffer) : r.buffer;
      return new r.constructor(f, r.byteOffset, r.length);
    }
    function jn(r, c) {
      var f = -1, w = r.length;
      for (c || (c = Array(w)); ++f < w; )
        c[f] = r[f];
      return c;
    }
    function ar(r, c, f, w) {
      f || (f = {});
      for (var L = -1, j = c.length; ++L < j; ) {
        var he = c[L], k = void 0;
        sr(f, he, k === void 0 ? r[he] : k);
      }
      return f;
    }
    function kn(r, c) {
      return ar(r, ir(r), c);
    }
    function $n(r) {
      return En(r, $t, ir);
    }
    function pt(r, c) {
      var f = r.__data__;
      return Fn(c) ? f[typeof c == "string" ? "string" : "hash"] : f.map;
    }
    function Xe(r, c) {
      var f = ct(r, c);
      return An(f) ? f : void 0;
    }
    var ir = Ue ? Re(Ue, Object) : Yn, ke = Cn;
    (h && ke(new h(new ArrayBuffer(1))) != q || m && ke(new m()) != E || C && ke(C.resolve()) != N || a && ke(new a()) != _e || l && ke(new l()) != se) && (ke = function(r) {
      var c = Se.call(r), f = c == b ? r.constructor : void 0, w = f ? $e(f) : void 0;
      if (w)
        switch (w) {
          case T:
            return q;
          case M:
            return E;
          case ee:
            return N;
          case We:
            return _e;
          case Ie:
            return se;
        }
      return c;
    });
    function Hn(r) {
      var c = r.length, f = r.constructor(c);
      return c && typeof r[0] == "string" && D.call(r, "index") && (f.index = r.index, f.input = r.input), f;
    }
    function Vn(r) {
      return typeof r.constructor == "function" && !cr(r) ? bn(ft(r)) : {};
    }
    function Dn(r, c, f, w) {
      var L = r.constructor;
      switch (c) {
        case ge:
          return jt(r);
        case g:
        case _:
          return new L(+r);
        case q:
          return xn(r, w);
        case ae:
        case ye:
        case ie:
        case me:
        case De:
        case Te:
        case Z:
        case xe:
        case U:
          return In(r, w);
        case E:
          return Rn(r, w, f);
        case I:
        case Ve:
          return new L(r);
        case G:
          return Pn(r);
        case _e:
          return Nn(r, w, f);
        case Oe:
          return Ln(r);
      }
    }
    function Mn(r, c) {
      return c = c ?? s, !!c && (typeof r == "number" || rt.test(r)) && r > -1 && r % 1 == 0 && r < c;
    }
    function Fn(r) {
      var c = typeof r;
      return c == "string" || c == "number" || c == "symbol" || c == "boolean" ? r !== "__proto__" : r === null;
    }
    function Bn(r) {
      return !!fe && fe in r;
    }
    function cr(r) {
      var c = r && r.constructor, f = typeof c == "function" && c.prototype || le;
      return r === f;
    }
    function $e(r) {
      if (r != null) {
        try {
          return Ne.call(r);
        } catch {
        }
        try {
          return r + "";
        } catch {
        }
      }
      return "";
    }
    function Kn(r) {
      return It(r, !0, !0);
    }
    function ur(r, c) {
      return r === c || r !== r && c !== c;
    }
    function Gn(r) {
      return qn(r) && D.call(r, "callee") && (!qe.call(r, "callee") || Se.call(r) == i);
    }
    var kt = Array.isArray;
    function lr(r) {
      return r != null && Wn(r.length) && !fr(r);
    }
    function qn(r) {
      return zn(r) && lr(r);
    }
    var Un = Ce || Jn;
    function fr(r) {
      var c = _t(r) ? Se.call(r) : "";
      return c == p || c == v;
    }
    function Wn(r) {
      return typeof r == "number" && r > -1 && r % 1 == 0 && r <= s;
    }
    function _t(r) {
      var c = typeof r;
      return !!r && (c == "object" || c == "function");
    }
    function zn(r) {
      return !!r && typeof r == "object";
    }
    function $t(r) {
      return lr(r) ? Sn(r) : On(r);
    }
    function Yn() {
      return [];
    }
    function Jn() {
      return !1;
    }
    e.exports = Kn;
  }(dt, dt.exports)), dt.exports;
}
var wo = mo();
const vr = /* @__PURE__ */ er(wo), So = pe({
  name: "FormController",
  props: {
    action: {
      type: String,
      required: !1
    },
    method: {
      type: String,
      required: !1,
      default: "POST"
    },
    data: {
      type: Object,
      required: !1,
      default: {}
    },
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    onSubmit: {
      type: Function,
      required: !1
    }
  },
  slots: Object,
  setup(e, { slots: t, expose: n }) {
    const o = yo(vr(F(e.data)), F(e.readonly)), s = Rt(), i = P(bt, null), { data: d, processing: g, readonly: _, errors: S, touched: p } = o, v = H(() => i ? "div" : "form"), E = H(() => i ? {
      "data-action": e.action,
      "data-method": e.method
    } : {
      action: e.action,
      method: e.method
    });
    function I() {
      if (e.onSubmit)
        return e.onSubmit(d.value, o);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return s.dispatch(e.method, e.action, { data: d.value });
    }
    function b() {
      let N = _.value;
      g.value = !0, _.value = !0, S.value = {}, p.value = {}, ne(() => I().catch((G) => {
        G instanceof St && (S.value = G.errors);
      }).finally(() => {
        g.value = !1, _.value = N;
      }));
    }
    return gr(() => e.data, (N) => {
      d.value = vr(F(N));
    }), gr(() => e.readonly, (N) => {
      _.value = F(N);
    }), n({
      ctx: o,
      submit: b
    }), O(bt, o), () => oe(v.value, { class: "form", ...E.value }, t.default({
      data: d.value,
      processing: g.value,
      errors: S.value,
      touched: p.value,
      ctx: o,
      submit: b
    }));
  }
}), Pr = Symbol("ViewResolver"), Pt = Symbol("StackedView"), Nt = Symbol("StackedViewDepth"), Nr = Symbol("StackedViewParent"), Lr = Symbol("StackedViewLocation"), Ir = Symbol("StackedViewQuery");
function vo(e) {
  return Array.isArray(e) ? e : [e];
}
function bo() {
  const e = P(Pr);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function Eo() {
  const e = P(Pt);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function Co() {
  const e = P(Nt);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const tr = pe({
  inheritAttrs: !1,
  name: "RouterView",
  props: {
    allowLayouts: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  slots: Object,
  setup(e, { slots: t }) {
    const n = bo(), o = Co(), s = Eo(), i = H(() => {
      var _;
      return (_ = s.value) == null ? void 0 : _.location;
    }), d = H(() => {
      var _;
      return (_ = s.value) == null ? void 0 : _.query;
    }), g = H(() => {
      if (s.value && s.value.child)
        return { ...s.value.child, parent: s.value };
    });
    return O(Pt, g), O(Nt, H(() => o.value + 1)), O(Nr, H(() => {
      var _;
      return (_ = s.value) == null ? void 0 : _.parent;
    })), O(Lr, i), O(Ir, d), () => {
      if (s.value && "component" in s.value) {
        let _ = n(s.value.component), S = s.value.props;
        _.inheritAttrs = !!_.inheritAttrs;
        let p = oe(_, S);
        return e.allowLayouts && _.layout && (p = vo(_.layout).concat(p).reverse().reduce((v, E) => (E = typeof E == "string" ? n(E) : E, E.inheritAttrs = !!E.inheritAttrs, oe(E, S, () => v)))), p;
      }
      if (t.default)
        return t.default();
    };
  }
}), Ao = pe({
  name: "RouterLink",
  props: {
    method: { type: String, required: !1, default: "GET" },
    href: { type: String, required: !1 },
    data: { type: [Object, Array, String, null], required: !1 },
    preserveScroll: { type: Boolean, required: !1 },
    replace: { type: Boolean, required: !1 },
    target: { type: String, required: !1 },
    disabled: { type: Boolean, required: !1 },
    explicit: { type: Boolean, required: !1 }
  },
  setup(e, { attrs: t, slots: n }) {
    const o = xr(), s = Rt(), i = R(!1), d = H(() => {
      var b;
      let p = o.value.replace(/\/$/, ""), v = (b = e.href) == null ? void 0 : b.replace(/\/$/, ""), E = p === v, I = !e.explicit && v && o.value.startsWith(v);
      return E || I;
    }), g = H(() => e.href ? "a" : "button"), _ = H(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function S(p) {
      if (!e.href || !Oo(p, e.href, e.target) || (p.preventDefault(), e.disabled))
        return;
      let { method: v, href: E, data: I, preserveScroll: b, replace: N } = e;
      i.value = !0, ne(() => {
        s.dispatch(v, E, { data: I, preserveScroll: b, replace: N }).then(() => {
          i.value = !1;
        }).catch(() => {
          i.value = !1;
        });
      });
    }
    return () => oe(
      g.value,
      {
        href: e.href,
        onClick: S,
        ..._.value,
        ...t,
        class: [{ active: d.value, pending: i.value, disabled: e.disabled }]
      },
      // @ts-ignore
      n.default({ active: d, pending: i })
    );
  }
});
function Oo(e, t, n) {
  return n === "_blank" || To(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function To(e) {
  try {
    let t = window.location.host, n = new URL(e).host;
    return t !== n;
  } catch {
    return !1;
  }
}
const Et = Symbol("ToastRegistry");
function jr() {
  let e = P(Et);
  if (!e)
    throw new Error("Toasts are used out of router context!");
  return e;
}
const xo = pe({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = jr();
    return () => oe("div", n, t.default({ toasts: o.value }));
  }
}), Ro = pe({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = jr(), s = R();
    function i() {
      clearTimeout(s.value), o.value = o.value.filter((d) => d.id !== e.toast.id);
    }
    return Tt(() => {
      s.value = setTimeout(() => i(), e.toast.duration * 1e3);
    }), Ut(() => {
      clearTimeout(s.value);
    }), () => oe("li", n, t.default({ toast: e.toast, close: i }));
  }
}), Po = pe({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Rt(), s = R(), i = R(!1);
    function d(S) {
      s.value = S, i.value = !0;
    }
    async function g(S) {
      let { method: p, url: v, options: E } = s.value;
      return await o.post(e.action, S).then(async () => await o.dispatch(p, v, E).then(async (I) => (_(), await ne(() => I))));
    }
    function _() {
      i.value = !1, s.value = void 0;
    }
    return Tt(() => {
      Kt.addEventListener("password.confirm", d);
    }), Ut(() => {
      Kt.removeEventListener("password.confirm", d);
    }), () => oe("div", n, t.default({ open: i.value, submit: g, cancel: _ }));
  }
});
function No(e, t) {
  return $r(kr(e), t);
}
function Lo(e, t, n) {
  return $r(Io(kr(e), t), n);
}
function kr(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function Io(e, t) {
  let n = e.split("|"), o = jo(n, t);
  if (o)
    return o.trim();
  n = $o(n);
  let s = Ho(t);
  return n.length === 1 || n[s] == null ? n[0] : n[s];
}
function jo(e, t) {
  for (let n in e) {
    let o = ko(n, t);
    if (o)
      return o;
  }
}
function ko(e, t) {
  const n = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s, o = e.match(n);
  if (!o || o.length !== 3)
    return null;
  const s = o[1], i = o[2];
  if (s.includes(",")) {
    const [d, g] = s.split(",", 2);
    if (g === "*" && t >= Number(d))
      return i;
    if (d === "*" && t <= Number(g))
      return i;
    if (t >= Number(d) && t <= Number(g))
      return i;
  }
  return Number(s) == t ? i : null;
}
function $o(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function $r(e, t) {
  return t ? Object.keys(t).reduce((n, o) => n.replace(`:${o}`, t[o].toString()), e) : e;
}
function Ho(e) {
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
      return e == 1 ? 0 : 1;
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
      return e == 0 || e == 1 ? 0 : 1;
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
      return e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
    case "cs":
    case "cs_CZ":
    case "sk":
    case "sk_SK":
      return e == 1 ? 0 : e >= 2 && e <= 4 ? 1 : 2;
    case "ga":
    case "ga_IE":
      return e == 1 ? 0 : e == 2 ? 1 : 2;
    case "lt":
    case "lt_LT":
      return e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
    case "sl":
    case "sl_SI":
      return e % 100 == 1 ? 0 : e % 100 == 2 ? 1 : e % 100 == 3 || e % 100 == 4 ? 2 : 3;
    case "mk":
    case "mk_MK":
      return e % 10 == 1 ? 0 : 1;
    case "mt":
    case "mt_MT":
      return e == 1 ? 0 : e == 0 || e % 100 > 1 && e % 100 < 11 ? 1 : e % 100 > 10 && e % 100 < 20 ? 2 : 3;
    case "lv":
    case "lv_LV":
      return e == 0 ? 0 : e % 10 == 1 && e % 100 != 11 ? 1 : 2;
    case "pl":
    case "pl_PL":
      return e == 1 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 12 || e % 100 > 14) ? 1 : 2;
    case "cy":
    case "cy_GB":
      return e == 1 ? 0 : e == 2 ? 1 : e == 8 || e == 11 ? 2 : 3;
    case "ro":
    case "ro_RO":
      return e == 1 ? 0 : e == 0 || e % 100 > 0 && e % 100 < 20 ? 1 : 2;
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
      return e == 0 ? 0 : e == 1 ? 1 : e == 2 ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 && e % 100 <= 99 ? 4 : 5;
    default:
      return 0;
  }
}
function Hr(e, t, n, o) {
  const s = new URL(e, o || APP_URL);
  return t && Vo(s.searchParams, t), n && (s.hash = n), s.toString();
}
function Vo(e, t) {
  Object.keys(t).forEach((n) => {
    Gt(e, n, X(t[n]));
  });
}
function Gt(e, t, n, o) {
  return o && (t = o + "[" + t + "]"), n == null ? (e.append(t, ""), e) : Array.isArray(n) ? (n.forEach((s, i) => {
    Gt(e, i.toString(), s, t);
  }), e) : typeof n == "object" ? (Object.keys(n).forEach((s) => {
    Gt(e, s, n[s], t);
  }), e) : (typeof n == "boolean" && (n = Number(n)), n == null && (n = ""), e.append(t, n), e);
}
function Do(e, t = {}, n) {
  return Fo(Mo(e), t, n);
}
function Mo(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Fo(e, t, n) {
  const o = APP_ROUTES[e];
  if (!o)
    throw new Error(`Undefined route: ${e}`);
  const s = Bo(o, t), i = Object.keys(t).reduce((d, g) => (o.params.includes(g) || (d[g] = X(t[g])), d), {});
  return Hr(s, i, n, o.domain);
}
function Bo(e, t) {
  return e.params.reduce((n, o) => {
    let s = e.binding[o] || "id", i = X(t[o]);
    if (typeof i == "object" && (i = i[s]), !i)
      throw new Error(`Parameter ${o} is required for uri ${e.uri}.`);
    return n.replace(new RegExp(`{${o}??}`), i);
  }, e.uri);
}
const Ko = pe({
  inheritAttrs: !1,
  name: "RouterNestedView",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t }) {
    const n = Rt(), o = R(!0);
    return Tt(() => {
      n.get(e.action).then(() => ne(() => {
        o.value = !1;
      }));
    }), () => {
      if (o.value) {
        if (t.default)
          return t.default();
      } else
        return oe(tr);
    };
  }
}), Go = pe({
  inheritAttrs: !1,
  name: "RouterNested",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t }) {
    const n = R(e.action), o = R(void 0), s = R(void 0), i = R(void 0), d = P(vt), g = P(Et);
    function _() {
      return {
        location: X(F(n)),
        signature: X(F(i)),
        stack: X(F(s))
      };
    }
    async function S(p) {
      return o.value = p.abilities, d.value = p.authenticated, p.location && (n.value = p.location), p.signature && (i.value = p.signature), p.stack && (s.value = Zt(X(F(s.value)), p.stack)), p.toasts && p.toasts.length > 0 && (g.value = [...g.value, ...p.toasts]), await ne(() => _());
    }
    return O(Yt, o), O(vt, d), O(Wt, n), O(zt, i), O(Jt, S), O(Nt, H(() => 0)), O(Pt, s), O(Et, g), O(Rr, !0), O(Xt, {
      historyPushState(p) {
      },
      historyReplaceState(p) {
      }
    }), () => oe(Ko, { action: e.action }, t);
  }
});
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Lt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const qo = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const Ct = () => {
}, Uo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), rr = Array.isArray, tt = (e) => typeof e == "function", K = (e) => typeof e == "string", nr = (e) => e !== null && typeof e == "object", At = (e) => (nr(e) || tt(e)) && tt(e.then) && tt(e.catch), Wo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, zo = /\B([A-Z])/g, Yo = Wo(
  (e) => e.replace(zo, "-$1").toLowerCase()
);
let br;
const Jo = () => br || (br = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Vr(e) {
  if (rr(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = K(o) ? es(o) : Vr(o);
      if (s)
        for (const i in s)
          t[i] = s[i];
    }
    return t;
  } else if (K(e) || nr(e))
    return e;
}
const Xo = /;(?![^(]*\))/g, Zo = /:([^]+)/, Qo = /\/\*[^]*?\*\//g;
function es(e) {
  const t = {};
  return e.replace(Qo, "").split(Xo).forEach((n) => {
    if (n) {
      const o = n.split(Zo);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function ts(e) {
  if (!e) return "";
  if (K(e)) return e;
  let t = "";
  for (const n in e) {
    const o = e[n];
    if (K(o) || typeof o == "number") {
      const s = n.startsWith("--") ? n : Yo(n);
      t += `${s}:${o};`;
    }
  }
  return t;
}
function Dr(e) {
  let t = "";
  if (K(e))
    t = e;
  else if (rr(e))
    for (let n = 0; n < e.length; n++) {
      const o = Dr(e[n]);
      o && (t += o + " ");
    }
  else if (nr(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const rs = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", ns = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", os = /* @__PURE__ */ Lt(rs), ss = /* @__PURE__ */ Lt(ns), as = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", is = /* @__PURE__ */ Lt(
  as + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function cs(e) {
  return !!e || e === "";
}
const us = /[>/="'\u0009\u000a\u000c\u0020]/, Mt = {};
function ls(e) {
  if (Mt.hasOwnProperty(e))
    return Mt[e];
  const t = us.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), Mt[e] = !t;
}
const fs = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function ds(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const hs = /["'&<>]/;
function Ae(e) {
  const t = "" + e, n = hs.exec(t);
  if (!n)
    return t;
  let o = "", s, i, d = 0;
  for (i = n.index; i < t.length; i++) {
    switch (t.charCodeAt(i)) {
      case 34:
        s = "&quot;";
        break;
      case 38:
        s = "&amp;";
        break;
      case 39:
        s = "&#39;";
        break;
      case 60:
        s = "&lt;";
        break;
      case 62:
        s = "&gt;";
        break;
      default:
        continue;
    }
    d !== i && (o += t.slice(d, i)), d = i + 1, o += s;
  }
  return d !== i ? o + t.slice(d, i) : o;
}
const ps = /^-?>|<!--|-->|--!>|<!-$/g;
function _s(e) {
  return e.replace(ps, "");
}
/**
* @vue/server-renderer v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const gs = /* @__PURE__ */ Lt(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function ys(e, t) {
  let n = "";
  for (const o in e) {
    if (gs(o) || Uo(o) || t === "textarea" && o === "value")
      continue;
    const s = e[o];
    o === "class" ? n += ` class="${ws(s)}"` : o === "style" ? n += ` style="${Ss(s)}"` : o === "className" ? n += ` class="${String(s)}"` : n += ms(o, s, t);
  }
  return n;
}
function ms(e, t, n) {
  if (!ds(t))
    return "";
  const o = n && (n.indexOf("-") > 0 || os(n)) ? e : fs[e] || e.toLowerCase();
  return is(o) ? cs(t) ? ` ${o}` : "" : ls(o) ? t === "" ? ` ${o}` : ` ${o}="${Ae(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${o}`
  ), "");
}
function ws(e) {
  return Ae(Dr(e));
}
function Ss(e) {
  if (!e)
    return "";
  if (K(e))
    return Ae(e);
  const t = Vr(e);
  return Ae(ts(t));
}
const { ensureValidVNode: ra } = xt;
function vs(e, t, n, o, s) {
  e("<!--teleport start-->");
  const i = s.appContext.provides[Tr], d = i.__teleportBuffers || (i.__teleportBuffers = {}), g = d[n] || (d[n] = []), _ = g.length;
  let S;
  if (o)
    t(e), S = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: p, push: v } = zr();
    v("<!--teleport start anchor-->"), t(v), v("<!--teleport anchor-->"), S = p();
  }
  g.splice(_, 0, S), e("<!--teleport end-->");
}
Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function qt(e) {
  const t = e && e.__v_raw;
  return t ? qt(t) : e;
}
function bs(e) {
  return e ? e.__v_isRef === !0 : !1;
}
const He = [];
function Es(e) {
  He.push(e);
}
function Cs() {
  He.pop();
}
let Ft = !1;
function Mr(e, ...t) {
  if (Ft) return;
  Ft = !0;
  const n = He.length ? He[He.length - 1].component : null, o = n && n.appContext.config.warnHandler, s = As();
  if (o)
    Kr(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((i) => {
          var d, g;
          return (g = (d = i.toString) == null ? void 0 : d.call(i)) != null ? g : JSON.stringify(i);
        }).join(""),
        n && n.proxy,
        s.map(
          ({ vnode: i }) => `at <${qr(n, i.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const i = [`[Vue warn]: ${e}`, ...t];
    s.length && i.push(`
`, ...Os(s)), console.warn(...i);
  }
  Ft = !1;
}
function As() {
  let e = He[He.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function Os(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...Ts(n));
  }), t;
}
function Ts({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, s = ` at <${qr(
    e.component,
    e.type,
    o
  )}`, i = ">" + n;
  return e.props ? [s, ...xs(e.props), i] : [s + i];
}
function xs(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Fr(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Fr(e, t, n) {
  return K(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : bs(t) ? (t = Fr(e, qt(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : tt(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = qt(t), n ? t : [`${e}=`, t]);
}
const Br = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function Kr(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (s) {
    Rs(s, t, n);
  }
}
function Rs(e, t, n, o = !0) {
  const s = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: d } = t && t.appContext.config || qo;
  if (t) {
    let g = t.parent;
    const _ = t.proxy, S = process.env.NODE_ENV !== "production" ? Br[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; g; ) {
      const p = g.ec;
      if (p) {
        for (let v = 0; v < p.length; v++)
          if (p[v](e, _, S) === !1)
            return;
      }
      g = g.parent;
    }
    if (i) {
      Kr(i, null, 10, [
        e,
        _,
        S
      ]);
      return;
    }
  }
  Ps(e, n, s, o, d);
}
function Ps(e, t, n, o = !0, s = !1) {
  if (process.env.NODE_ENV !== "production") {
    const i = Br[t];
    if (n && Es(n), Mr(`Unhandled error${i ? ` during execution of ${i}` : ""}`), n && Cs(), o)
      throw e;
    console.error(e);
  } else {
    if (s)
      throw e;
    console.error(e);
  }
}
let Qe, yt = [];
function Gr(e, t) {
  var n, o;
  Qe = e, Qe ? (Qe.enabled = !0, yt.forEach(({ event: s, args: i }) => Qe.emit(s, ...i)), yt = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((o = (n = window.navigator) == null ? void 0 : n.userAgent) != null && o.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((i) => {
    Gr(i, t);
  }), setTimeout(() => {
    Qe || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, yt = []);
  }, 3e3)) : yt = [];
}
{
  const e = Jo(), t = (n, o) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(o), (i) => {
      s.length > 1 ? s.forEach((d) => d(i)) : s[0](i);
    };
  };
  t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => n
  ), t(
    "__VUE_SSR_SETTERS__",
    (n) => n
  );
}
process.env.NODE_ENV;
const Ns = /(?:^|[-_])(\w)/g, Ls = (e) => e.replace(Ns, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Is(e, t = !0) {
  return tt(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function qr(e, t, n = !1) {
  let o = Is(t);
  if (!o && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (o = s[1]);
  }
  if (!o && e && e.parent) {
    const s = (i) => {
      for (const d in i)
        if (i[d] === t)
          return d;
    };
    o = s(
      e.components || e.parent.type.components
    ) || s(e.appContext.components);
  }
  return o ? Ls(o) : n ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function js(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: ks,
  setCurrentRenderingInstance: Er,
  setupComponent: $s,
  renderComponentRoot: Cr,
  normalizeVNode: Hs,
  pushWarningContext: Ur,
  popWarningContext: Wr
} = xt;
function zr() {
  let e = !1;
  const t = [];
  return {
    getBuffer() {
      return t;
    },
    push(n) {
      const o = K(n);
      if (e && o) {
        t[t.length - 1] += n;
        return;
      }
      t.push(n), e = o, (At(n) || rr(n) && n.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function Yr(e, t = null, n) {
  const o = e.component = ks(
    e,
    t,
    null
  );
  process.env.NODE_ENV !== "production" && Ur(e);
  const s = $s(
    o,
    !0
    /* isSSR */
  );
  process.env.NODE_ENV !== "production" && Wr();
  const i = At(s);
  let d = o.sp;
  return i || d ? Promise.resolve(s).then(() => {
    if (i && (d = o.sp), d)
      return Promise.all(
        d.map((_) => _.call(o.proxy))
      );
  }).catch(Ct).then(() => Ar(o, n)) : Ar(o, n);
}
function Ar(e, t) {
  process.env.NODE_ENV !== "production" && Ur(e.vnode);
  const n = e.type, { getBuffer: o, push: s } = zr();
  if (tt(n)) {
    let i = Cr(e);
    if (!n.props)
      for (const d in e.attrs)
        d.startsWith("data-v-") && ((i.props || (i.props = {}))[d] = "");
    Ot(s, e.subTree = i, e, t);
  } else {
    (!e.render || e.render === Ct) && !e.ssrRender && !n.ssrRender && K(n.template) && (n.ssrRender = js(n.template));
    const i = e.ssrRender || n.ssrRender;
    if (i) {
      let d = e.inheritAttrs !== !1 ? e.attrs : void 0, g = !1, _ = e;
      for (; ; ) {
        const p = _.vnode.scopeId;
        p && (g || (d = { ...d }, g = !0), d[p] = "");
        const v = _.parent;
        if (v && v.subTree && v.subTree === _.vnode)
          _ = v;
        else
          break;
      }
      if (t) {
        g || (d = { ...d });
        const p = t.trim().split(" ");
        for (let v = 0; v < p.length; v++)
          d[p[v]] = "";
      }
      const S = Er(e);
      try {
        i(
          e.proxy,
          s,
          e,
          d,
          // compiler-optimized bindings
          e.props,
          e.setupState,
          e.data,
          e.ctx
        );
      } finally {
        Er(S);
      }
    } else if (e.render && e.render !== Ct)
      Ot(
        s,
        e.subTree = Cr(e),
        e,
        t
      );
    else {
      const d = n.name || n.__file || "<Anonymous>";
      wt(`Component ${d} is missing template or render function.`), s("<!---->");
    }
  }
  return process.env.NODE_ENV !== "production" && Wr(), o();
}
function Ot(e, t, n, o) {
  const { type: s, shapeFlag: i, children: d, dirs: g, props: _ } = t;
  switch (g && (t.props = Ds(t, _, g)), s) {
    case so:
      e(Ae(d));
      break;
    case oo:
      e(
        d ? `<!--${_s(d)}-->` : "<!---->"
      );
      break;
    case no:
      e(d);
      break;
    case ro:
      t.slotScopeIds && (o = (o ? o + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), or(
        e,
        d,
        n,
        o
      ), e("<!--]-->");
      break;
    default:
      i & 1 ? Vs(e, t, n, o) : i & 6 ? e(Yr(t, n, o)) : i & 64 ? Ms(e, t, n, o) : i & 128 ? Ot(e, t.ssContent, n, o) : wt(
        "[@vue/server-renderer] Invalid VNode type:",
        s,
        `(${typeof s})`
      );
  }
}
function or(e, t, n, o) {
  for (let s = 0; s < t.length; s++)
    Ot(e, Hs(t[s]), n, o);
}
function Vs(e, t, n, o) {
  const s = t.type;
  let { props: i, children: d, shapeFlag: g, scopeId: _ } = t, S = `<${s}`;
  i && (S += ys(i, s)), _ && (S += ` ${_}`);
  let p = n, v = t;
  for (; p && v === p.subTree; )
    v = p.vnode, v.scopeId && (S += ` ${v.scopeId}`), p = p.parent;
  if (o && (S += ` ${o}`), e(S + ">"), !ss(s)) {
    let E = !1;
    i && (i.innerHTML ? (E = !0, e(i.innerHTML)) : i.textContent ? (E = !0, e(Ae(i.textContent))) : s === "textarea" && i.value && (E = !0, e(Ae(i.value)))), E || (g & 8 ? e(Ae(d)) : g & 16 && or(
      e,
      d,
      n,
      o
    )), e(`</${s}>`);
  }
}
function Ds(e, t, n) {
  const o = [];
  for (let s = 0; s < n.length; s++) {
    const i = n[s], {
      dir: { getSSRProps: d }
    } = i;
    if (d) {
      const g = d(i, e);
      g && o.push(g);
    }
  }
  return ao(t || {}, ...o);
}
function Ms(e, t, n, o) {
  const s = t.props && t.props.to, i = t.props && t.props.disabled;
  if (!s)
    return i || wt("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!K(s))
    return wt(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  vs(
    e,
    (d) => {
      or(
        d,
        t.children,
        n,
        o
      );
    },
    s,
    i || i === "",
    n
  );
}
const { isVNode: Fs } = xt;
function mt(e, t, n) {
  if (!e.hasAsync)
    return t + Xr(e);
  let o = t;
  for (let s = n; s < e.length; s += 1) {
    const i = e[s];
    if (K(i)) {
      o += i;
      continue;
    }
    if (At(i))
      return i.then((g) => (e[s] = g, mt(e, o, s)));
    const d = mt(i, o, 0);
    if (At(d))
      return d.then((g) => (e[s] = g, mt(e, "", s)));
    o = d;
  }
  return o;
}
function Jr(e) {
  return mt(e, "", 0);
}
function Xr(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) {
    let o = e[n];
    K(o) ? t += o : t += Xr(o);
  }
  return t;
}
async function Zr(e, t = {}) {
  if (Fs(e))
    return Zr(eo({ render: () => e }), t);
  const n = to(e._component, e._props);
  n.appContext = e._context, e.provide(Tr, t);
  const o = await Yr(n), s = await Jr(o);
  if (await Bs(t), t.__watcherHandles)
    for (const i of t.__watcherHandles)
      i();
  return s;
}
async function Bs(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await Jr(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
const { isVNode: na } = xt;
Qn();
const Ks = pe({
  inheritAttrs: !1,
  name: "Router",
  props: {
    resolver: {
      type: Function,
      required: !0
    },
    state: {
      type: Object,
      required: !0
    }
  },
  setup(e) {
    const t = R(e.state.abilities), n = R(e.state.authenticated), o = R(e.state.location), s = R(e.state.stack), i = R(e.state.signature), d = R(e.state.toasts);
    function g() {
      return {
        location: X(F(o)),
        signature: X(F(i)),
        stack: X(F(s))
      };
    }
    async function _(p) {
      return t.value = p.abilities, n.value = p.authenticated, p.location && (o.value = p.location), p.signature && (i.value = p.signature), p.stack && (s.value = Zt(X(F(s.value)), p.stack)), p.toasts && p.toasts.length > 0 && (d.value = [...d.value, ...p.toasts]), await ne(() => g());
    }
    O(Yt, t), O(vt, n), O(Wt, o), O(zt, i), O(Jt, _), O(Pr, e.resolver), O(Nt, H(() => 0)), O(Pt, s), O(Et, d), O(Xt, {
      historyPushState(p) {
        window.history.pushState(p, "", p.location);
      },
      historyReplaceState(p) {
        window.history.replaceState(p, "", p.location);
      }
    });
    function S(p) {
      p.state ? (o.value = p.state.location, s.value = p.state.stack, i.value = p.state.signature) : (window.history.replaceState(g(), "", o.value), window.scroll(0, 0));
    }
    return Tt(() => {
      window.history.replaceState(g(), "", o.value), window.addEventListener("popstate", S);
    }), Ut(() => {
      window.removeEventListener("popstate", S);
    }), () => oe(tr);
  }
});
async function oa({ initial: e, resolver: t, setup: n }) {
  const o = typeof window > "u", s = e || Gs(), i = n({ router: Ks, props: { resolver: t, state: s } });
  return o ? await Zr(i) : "";
}
function Gs() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
const et = R();
async function Or(e, t) {
  return new Promise((n, o) => {
    function s() {
      et.value.processing = !0, ne(() => {
        Promise.resolve(t()).then((d) => {
          et.value = void 0, ne(() => n(d));
        }).catch((d) => {
          et.value = void 0, ne(() => o(d));
        });
      });
    }
    function i() {
      et.value = void 0, ne(() => o());
    }
    et.value = { ...e, processing: !1, confirm: s, cancel: i };
  });
}
async function qs(e, t) {
  return t !== void 0 ? Or(e, t) : Or({}, e);
}
function sa() {
  return et;
}
function aa() {
  return qs;
}
function ia() {
  return R();
}
function ca() {
  return P(bt, null);
}
function ua() {
  let e = P(bt);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function la() {
  const e = P(Lr);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function Us() {
  const e = P(Nr);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function fa() {
  const e = Us();
  return H(() => {
    if (e && e.value && e.value.location)
      return Hr(e.value.location, e.value.query);
  });
}
function da() {
  const e = P(Ir);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function Ws(e) {
  return e ? APP_COUNTRIES_IMPLICITLY_ADDRESSES.includes(e) : !1;
}
function ha(e) {
  return !Ws(e);
}
function zs(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function pa(e) {
  return !zs(e);
}
function _a(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function ga(e) {
  return e.filter((t) => t.parentId === null);
}
function ya(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right && n.parentId === t.id);
}
function ma(e, t) {
  return e.filter((n) => n.left < t.left && n.right > t.right);
}
function wa(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right);
}
var Ys = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Ys || {});
function Sa() {
  return {
    install(e) {
      e.component("RouterNested", Go), e.component("RouterView", tr), e.component("RouterLink", Ao), e.component("FormController", So), e.component("ToastController", xo), e.component("PasswordConfirmationController", Po), e.component("Toast", Ro), e.config.globalProperties.$t = No, e.config.globalProperties.$tc = Lo, e.config.globalProperties.$route = Do;
    }
  };
}
export {
  St as CompleteResponse,
  lo as ErrorModal,
  Kt as EventBus,
  bt as FormContextInjectionKey,
  So as FormControllerComponent,
  Rr as HttpClientForceScrollPreservation,
  Qt as Request,
  Bt as Response,
  Ks as RouterComponent,
  Ao as RouterLinkComponent,
  tr as RouterViewComponent,
  Nt as StackedViewDepthInjectionKey,
  Pt as StackedViewInjectionKey,
  Lr as StackedViewLocationInjectionKey,
  Nr as StackedViewParentInjectionKey,
  Ir as StackedViewQueryInjectionKey,
  Pr as StackedViewResolverInjectionKey,
  Yt as StateAbilities,
  vt as StateAuthenticated,
  Xt as StateHistoryInjectionKey,
  Wt as StateLocationInjectionKey,
  Jt as StateManagerInjectionKey,
  zt as StateStackSignatureInjectionKey,
  Ro as ToastComponent,
  xo as ToastControllerComponent,
  Ys as ToastKind,
  Et as ToastRegistryInjectionKey,
  zs as blank,
  yo as createFormContext,
  oa as createFoundationController,
  Sa as createOtherSoftwareFoundation,
  pa as filled,
  ta as getModelFromContext,
  _a as hash,
  ha as isCountryExplicit,
  Ws as isCountryImplicit,
  ma as nestedSetAncestors,
  ya as nestedSetChildren,
  wa as nestedSetDescendants,
  ga as nestedSetRoot,
  Do as route,
  ea as setModelWithContext,
  No as trans,
  Lo as transChoice,
  Zt as updateStack,
  Hr as url,
  Zs as useAbilities,
  Qs as useAuthenticated,
  aa as useConfirmation,
  sa as useCurrentConfirmation,
  ia as useFormApi,
  ca as useFormContext,
  Rt as useHttpClient,
  xr as useLocation,
  ua as usePersistentFormContext,
  io as useStackSignature,
  uo as useStateHistory,
  co as useStateManager,
  jr as useToasts,
  Co as useViewDepth,
  la as useViewLocation,
  Us as useViewParent,
  fa as useViewParentLocation,
  da as useViewQuery,
  bo as useViewResolver,
  Eo as useViewStack,
  vo as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

var zn = Object.defineProperty;
var Yn = (e, t, n) => t in e ? zn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var x = (e, t, n) => Yn(e, typeof t != "symbol" ? t + "" : t, n);
import { inject as j, ref as P, defineComponent as De, toValue as Se, watch as ir, provide as N, h as Ee, nextTick as be, computed as ee, onMounted as Mt, onBeforeUnmount as Ht, toRaw as ke, ssrUtils as Ct, initDirectivesForSSR as Jn, createApp as Xn, createVNode as Zn, ssrContextKey as mr, warn as wt, Fragment as Qn, Static as eo, Comment as to, Text as ro, mergeProps as no } from "vue";
class kt {
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
class St extends kt {
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
const wr = Symbol("StateLocation"), Sr = Symbol("StateStackSignature"), br = Symbol("StateAuthenticated"), vr = Symbol("StateAbilities"), Er = Symbol("StateManager");
function Ws() {
  let e = j(vr);
  if (!e)
    throw new Error("Abilities are used out of router context!");
  return e;
}
function zs() {
  let e = j(br);
  if (!e)
    throw new Error("Authenticated is used out of router context!");
  return e;
}
function oo() {
  let e = j(wr);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function so() {
  let e = j(Sr);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function ao() {
  let e = j(Er);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function Cr(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Cr(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class Ft {
  constructor(t, n, o = void 0, s = void 0, u = !1) {
    x(this, "method");
    x(this, "url");
    x(this, "xhr");
    x(this, "body");
    x(this, "signature");
    x(this, "refreshStack");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = n, this.body = o, this.signature = s, this.refreshStack = u;
  }
  static send(t, n, o = void 0, s = void 0, u = !1) {
    return new Ft(t, n, o, s, u).send();
  }
  send() {
    return new Promise((t, n) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.refreshStack && this.xhr.setRequestHeader("X-Stack-Refresh", "true"), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? n(new St(this.xhr)) : n(new kt(this.xhr)) : t(new St(this.xhr)));
      }, this.xhr.onerror = () => {
        n(new kt(this.xhr));
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
const io = {
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
}, Q = {}, $t = {
  addEventListener(e, t) {
    Q[e] ? Q[e].push(t) : Q[e] = [t];
  },
  removeEventListener(e, t) {
    Q[e] && (Q[e] = Q[e].filter((n) => n !== t), Q[e].length === 0 && delete Q[e]);
  },
  dispatch(e, t) {
    return Q[e] && Q[e].forEach((n) => n(t)), t;
  }
};
function Bt() {
  const e = ao(), t = so();
  async function n(p, g, { data: b = void 0, preserveScroll: _ = !1, replace: S = !1, refreshStack: v = !1 } = {}) {
    return document.body.classList.add("osf-loading"), await Ft.send(p, g, b, t.value, v).then(async (E) => await e.update(E).then((O) => E.redirect ? h(E.redirect) : E.raw ? Promise.resolve(E.raw) : (_ || u(), S ? s(O) : o(O), Promise.resolve(E)))).catch(async (E) => E instanceof St ? await e.update(E).then(() => Promise.reject(E)) : E.status === 423 ? ($t.dispatch("password.confirm", { method: p, url: g, options: { data: b, preserveScroll: _, replace: S } }), Promise.reject(E)) : (console.error(E), APP_DEBUG && E.content && io.show(E.content), Promise.reject(E))).finally(() => {
      document.body.classList.remove("osf-loading");
    });
  }
  function o(p) {
    window.history.pushState(p, "", p.location);
  }
  function s(p) {
    window.history.replaceState(p, "", p.location);
  }
  function u() {
    window.scroll(0, 0);
  }
  async function h(p) {
    return p.reload ? await new Promise(() => {
      window.location.href = p.target;
    }) : await n("GET", p.target, {
      preserveScroll: !0,
      replace: !1,
      refreshStack: !0
    });
  }
  return {
    dispatch: n,
    get: async function(p) {
      return await n("GET", p);
    },
    post: async function(p, g = void 0) {
      return await n("POST", p, { data: g, preserveScroll: !0 });
    },
    patch: async function(p, g = void 0) {
      return await n("PATCH", p, { data: g, preserveScroll: !0 });
    },
    put: async function(p, g = void 0) {
      return await n("PUT", p, { data: g, preserveScroll: !0 });
    },
    delete: async function(p, g = void 0) {
      return await n("DELETE", p, { data: g, preserveScroll: !0 });
    }
  };
}
var M = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Gt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Nt, cr;
function co() {
  if (cr) return Nt;
  cr = 1;
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = 9007199254740991, o = "[object Function]", s = "[object GeneratorFunction]", u = "[object Symbol]", h = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, p = /^\w*$/, g = /^\./, b = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, _ = /[\\^$.*+?()[\]{}|]/g, S = /\\(\\)?/g, v = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, O = typeof M == "object" && M && M.Object === Object && M, z = typeof self == "object" && self && self.Object === Object && self, F = O || z || Function("return this")();
  function le(a, l) {
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
  var Ce = Array.prototype, te = Function.prototype, fe = Object.prototype, B = F["__core-js_shared__"], re = function() {
    var a = /[^.]+$/.exec(B && B.keys && B.keys.IE_PROTO || "");
    return a ? "Symbol(src)_1." + a : "";
  }(), de = te.toString, ne = fe.hasOwnProperty, he = fe.toString, Me = RegExp(
    "^" + de.call(ne).replace(_, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ae = F.Symbol, Y = Ce.splice, Oe = Pe(F, "Map"), G = Pe(Object, "create"), $ = Ae ? Ae.prototype : void 0, He = $ ? $.toString : void 0;
  function K(a) {
    var l = -1, y = a ? a.length : 0;
    for (this.clear(); ++l < y; ) {
      var T = a[l];
      this.set(T[0], T[1]);
    }
  }
  function rt() {
    this.__data__ = G ? G(null) : {};
  }
  function A(a) {
    return this.has(a) && delete this.__data__[a];
  }
  function nt(a) {
    var l = this.__data__;
    if (G) {
      var y = l[a];
      return y === t ? void 0 : y;
    }
    return ne.call(l, a) ? l[a] : void 0;
  }
  function J(a) {
    var l = this.__data__;
    return G ? l[a] !== void 0 : ne.call(l, a);
  }
  function k(a, l) {
    var y = this.__data__;
    return y[a] = G && l === void 0 ? t : l, this;
  }
  K.prototype.clear = rt, K.prototype.delete = A, K.prototype.get = nt, K.prototype.has = J, K.prototype.set = k;
  function U(a) {
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
    var l = this.__data__, y = se(l, a);
    if (y < 0)
      return !1;
    var T = l.length - 1;
    return y == T ? l.pop() : Y.call(l, y, 1), !0;
  }
  function st(a) {
    var l = this.__data__, y = se(l, a);
    return y < 0 ? void 0 : l[y][1];
  }
  function q(a) {
    return se(this.__data__, a) > -1;
  }
  function at(a, l) {
    var y = this.__data__, T = se(y, a);
    return T < 0 ? y.push([a, l]) : y[T][1] = l, this;
  }
  U.prototype.clear = Fe, U.prototype.delete = ot, U.prototype.get = st, U.prototype.has = q, U.prototype.set = at;
  function W(a) {
    var l = -1, y = a ? a.length : 0;
    for (this.clear(); ++l < y; ) {
      var T = a[l];
      this.set(T[0], T[1]);
    }
  }
  function Be() {
    this.__data__ = {
      hash: new K(),
      map: new (Oe || U)(),
      string: new K()
    };
  }
  function it(a) {
    return ie(this, a).delete(a);
  }
  function ct(a) {
    return ie(this, a).get(a);
  }
  function oe(a) {
    return ie(this, a).has(a);
  }
  function Ge(a, l) {
    return ie(this, a).set(a, l), this;
  }
  W.prototype.clear = Be, W.prototype.delete = it, W.prototype.get = ct, W.prototype.has = oe, W.prototype.set = Ge;
  function Te(a, l, y) {
    var T = a[l];
    (!(ne.call(a, l) && Ue(T, y)) || y === void 0 && !(l in a)) && (a[l] = y);
  }
  function se(a, l) {
    for (var y = a.length; y--; )
      if (Ue(a[y][0], l))
        return y;
    return -1;
  }
  function ut(a) {
    if (!we(a) || ge(a))
      return !1;
    var l = qe(a) || Ve(a) ? Me : v;
    return l.test(ft(a));
  }
  function pe(a, l, y, T) {
    if (!we(a))
      return a;
    l = _e(l, a) ? [l] : xe(l);
    for (var V = -1, X = l.length, We = X - 1, Ne = a; Ne != null && ++V < X; ) {
      var ze = Re(l[V]), Le = y;
      if (V != We) {
        var Z = Ne[ze];
        Le = void 0, Le === void 0 && (Le = we(Z) ? Z : D(l[V + 1]) ? [] : {});
      }
      Te(Ne, ze, Le), Ne = Ne[ze];
    }
    return a;
  }
  function ae(a) {
    if (typeof a == "string")
      return a;
    if (d(a))
      return He ? He.call(a) : "";
    var l = a + "";
    return l == "0" && 1 / a == -1 / 0 ? "-0" : l;
  }
  function xe(a) {
    return me(a) ? a : Ke(a);
  }
  function ie(a, l) {
    var y = a.__data__;
    return lt(l) ? y[typeof l == "string" ? "string" : "hash"] : y.map;
  }
  function Pe(a, l) {
    var y = le(a, l);
    return ut(y) ? y : void 0;
  }
  function D(a, l) {
    return l = l ?? n, !!l && (typeof a == "number" || E.test(a)) && a > -1 && a % 1 == 0 && a < l;
  }
  function _e(a, l) {
    if (me(a))
      return !1;
    var y = typeof a;
    return y == "number" || y == "symbol" || y == "boolean" || a == null || d(a) ? !0 : p.test(a) || !h.test(a) || l != null && a in Object(l);
  }
  function lt(a) {
    var l = typeof a;
    return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? a !== "__proto__" : a === null;
  }
  function ge(a) {
    return !!re && re in a;
  }
  var Ke = ye(function(a) {
    a = m(a);
    var l = [];
    return g.test(a) && l.push(""), a.replace(b, function(y, T, V, X) {
      l.push(V ? X.replace(S, "$1") : T || y);
    }), l;
  });
  function Re(a) {
    if (typeof a == "string" || d(a))
      return a;
    var l = a + "";
    return l == "0" && 1 / a == -1 / 0 ? "-0" : l;
  }
  function ft(a) {
    if (a != null) {
      try {
        return de.call(a);
      } catch {
      }
      try {
        return a + "";
      } catch {
      }
    }
    return "";
  }
  function ye(a, l) {
    if (typeof a != "function" || l && typeof l != "function")
      throw new TypeError(e);
    var y = function() {
      var T = arguments, V = l ? l.apply(this, T) : T[0], X = y.cache;
      if (X.has(V))
        return X.get(V);
      var We = a.apply(this, T);
      return y.cache = X.set(V, We), We;
    };
    return y.cache = new (ye.Cache || W)(), y;
  }
  ye.Cache = W;
  function Ue(a, l) {
    return a === l || a !== a && l !== l;
  }
  var me = Array.isArray;
  function qe(a) {
    var l = we(a) ? he.call(a) : "";
    return l == o || l == s;
  }
  function we(a) {
    var l = typeof a;
    return !!a && (l == "object" || l == "function");
  }
  function c(a) {
    return !!a && typeof a == "object";
  }
  function d(a) {
    return typeof a == "symbol" || c(a) && he.call(a) == u;
  }
  function m(a) {
    return a == null ? "" : ae(a);
  }
  function C(a, l, y) {
    return a == null ? a : pe(a, l, y);
  }
  return Nt = C, Nt;
}
var uo = co();
const ur = /* @__PURE__ */ Gt(uo);
var Lt, lr;
function lo() {
  if (lr) return Lt;
  lr = 1;
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = "[object Function]", o = "[object GeneratorFunction]", s = "[object Symbol]", u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, h = /^\w*$/, p = /^\./, g = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, b = /[\\^$.*+?()[\]{}|]/g, _ = /\\(\\)?/g, S = /^\[object .+?Constructor\]$/, v = typeof M == "object" && M && M.Object === Object && M, E = typeof self == "object" && self && self.Object === Object && self, O = v || E || Function("return this")();
  function z(c, d) {
    return c == null ? void 0 : c[d];
  }
  function F(c) {
    var d = !1;
    if (c != null && typeof c.toString != "function")
      try {
        d = !!(c + "");
      } catch {
      }
    return d;
  }
  var le = Array.prototype, Ve = Function.prototype, Ce = Object.prototype, te = O["__core-js_shared__"], fe = function() {
    var c = /[^.]+$/.exec(te && te.keys && te.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), B = Ve.toString, re = Ce.hasOwnProperty, de = Ce.toString, ne = RegExp(
    "^" + B.call(re).replace(b, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), he = O.Symbol, Me = le.splice, Ae = ae(O, "Map"), Y = ae(Object, "create"), Oe = he ? he.prototype : void 0, G = Oe ? Oe.toString : void 0;
  function $(c) {
    var d = -1, m = c ? c.length : 0;
    for (this.clear(); ++d < m; ) {
      var C = c[d];
      this.set(C[0], C[1]);
    }
  }
  function He() {
    this.__data__ = Y ? Y(null) : {};
  }
  function K(c) {
    return this.has(c) && delete this.__data__[c];
  }
  function rt(c) {
    var d = this.__data__;
    if (Y) {
      var m = d[c];
      return m === t ? void 0 : m;
    }
    return re.call(d, c) ? d[c] : void 0;
  }
  function A(c) {
    var d = this.__data__;
    return Y ? d[c] !== void 0 : re.call(d, c);
  }
  function nt(c, d) {
    var m = this.__data__;
    return m[c] = Y && d === void 0 ? t : d, this;
  }
  $.prototype.clear = He, $.prototype.delete = K, $.prototype.get = rt, $.prototype.has = A, $.prototype.set = nt;
  function J(c) {
    var d = -1, m = c ? c.length : 0;
    for (this.clear(); ++d < m; ) {
      var C = c[d];
      this.set(C[0], C[1]);
    }
  }
  function k() {
    this.__data__ = [];
  }
  function U(c) {
    var d = this.__data__, m = oe(d, c);
    if (m < 0)
      return !1;
    var C = d.length - 1;
    return m == C ? d.pop() : Me.call(d, m, 1), !0;
  }
  function Fe(c) {
    var d = this.__data__, m = oe(d, c);
    return m < 0 ? void 0 : d[m][1];
  }
  function ot(c) {
    return oe(this.__data__, c) > -1;
  }
  function st(c, d) {
    var m = this.__data__, C = oe(m, c);
    return C < 0 ? m.push([c, d]) : m[C][1] = d, this;
  }
  J.prototype.clear = k, J.prototype.delete = U, J.prototype.get = Fe, J.prototype.has = ot, J.prototype.set = st;
  function q(c) {
    var d = -1, m = c ? c.length : 0;
    for (this.clear(); ++d < m; ) {
      var C = c[d];
      this.set(C[0], C[1]);
    }
  }
  function at() {
    this.__data__ = {
      hash: new $(),
      map: new (Ae || J)(),
      string: new $()
    };
  }
  function W(c) {
    return pe(this, c).delete(c);
  }
  function Be(c) {
    return pe(this, c).get(c);
  }
  function it(c) {
    return pe(this, c).has(c);
  }
  function ct(c, d) {
    return pe(this, c).set(c, d), this;
  }
  q.prototype.clear = at, q.prototype.delete = W, q.prototype.get = Be, q.prototype.has = it, q.prototype.set = ct;
  function oe(c, d) {
    for (var m = c.length; m--; )
      if (Ke(c[m][0], d))
        return m;
    return -1;
  }
  function Ge(c, d) {
    d = xe(d, c) ? [d] : ut(d);
    for (var m = 0, C = d.length; c != null && m < C; )
      c = c[_e(d[m++])];
    return m && m == C ? c : void 0;
  }
  function Te(c) {
    if (!ye(c) || Pe(c))
      return !1;
    var d = ft(c) || F(c) ? ne : S;
    return d.test(lt(c));
  }
  function se(c) {
    if (typeof c == "string")
      return c;
    if (me(c))
      return G ? G.call(c) : "";
    var d = c + "";
    return d == "0" && 1 / c == -1 / 0 ? "-0" : d;
  }
  function ut(c) {
    return Re(c) ? c : D(c);
  }
  function pe(c, d) {
    var m = c.__data__;
    return ie(d) ? m[typeof d == "string" ? "string" : "hash"] : m.map;
  }
  function ae(c, d) {
    var m = z(c, d);
    return Te(m) ? m : void 0;
  }
  function xe(c, d) {
    if (Re(c))
      return !1;
    var m = typeof c;
    return m == "number" || m == "symbol" || m == "boolean" || c == null || me(c) ? !0 : h.test(c) || !u.test(c) || d != null && c in Object(d);
  }
  function ie(c) {
    var d = typeof c;
    return d == "string" || d == "number" || d == "symbol" || d == "boolean" ? c !== "__proto__" : c === null;
  }
  function Pe(c) {
    return !!fe && fe in c;
  }
  var D = ge(function(c) {
    c = qe(c);
    var d = [];
    return p.test(c) && d.push(""), c.replace(g, function(m, C, a, l) {
      d.push(a ? l.replace(_, "$1") : C || m);
    }), d;
  });
  function _e(c) {
    if (typeof c == "string" || me(c))
      return c;
    var d = c + "";
    return d == "0" && 1 / c == -1 / 0 ? "-0" : d;
  }
  function lt(c) {
    if (c != null) {
      try {
        return B.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function ge(c, d) {
    if (typeof c != "function" || d && typeof d != "function")
      throw new TypeError(e);
    var m = function() {
      var C = arguments, a = d ? d.apply(this, C) : C[0], l = m.cache;
      if (l.has(a))
        return l.get(a);
      var y = c.apply(this, C);
      return m.cache = l.set(a, y), y;
    };
    return m.cache = new (ge.Cache || q)(), m;
  }
  ge.Cache = q;
  function Ke(c, d) {
    return c === d || c !== c && d !== d;
  }
  var Re = Array.isArray;
  function ft(c) {
    var d = ye(c) ? de.call(c) : "";
    return d == n || d == o;
  }
  function ye(c) {
    var d = typeof c;
    return !!c && (d == "object" || d == "function");
  }
  function Ue(c) {
    return !!c && typeof c == "object";
  }
  function me(c) {
    return typeof c == "symbol" || Ue(c) && de.call(c) == s;
  }
  function qe(c) {
    return c == null ? "" : se(c);
  }
  function we(c, d, m) {
    var C = c == null ? void 0 : Ge(c, d);
    return C === void 0 ? m : C;
  }
  return Lt = we, Lt;
}
var fo = lo();
const ho = /* @__PURE__ */ Gt(fo), Kt = Symbol("FormContext");
function po(e = {}, t = !1) {
  const n = P(e), o = P({}), s = P({}), u = P(!1), h = P(t);
  function p(_) {
    ur(s.value, _, !0);
  }
  function g(_, S) {
    return ho(n.value, _, S);
  }
  function b(_, S) {
    ur(n.value, _, S);
  }
  return {
    data: n,
    errors: o,
    touched: s,
    processing: u,
    readonly: h,
    touch: p,
    value: g,
    fill: b
  };
}
function Ys(e, t, n) {
  return e && t && (t.touch(e), t.fill(e, n)), n;
}
function Js(e, t, n) {
  return e && t ? t.value(e, n) : n;
}
var dt = { exports: {} };
dt.exports;
var fr;
function _o() {
  return fr || (fr = 1, function(e, t) {
    var n = 200, o = "__lodash_hash_undefined__", s = 9007199254740991, u = "[object Arguments]", h = "[object Array]", p = "[object Boolean]", g = "[object Date]", b = "[object Error]", _ = "[object Function]", S = "[object GeneratorFunction]", v = "[object Map]", E = "[object Number]", O = "[object Object]", z = "[object Promise]", F = "[object RegExp]", le = "[object Set]", Ve = "[object String]", Ce = "[object Symbol]", te = "[object WeakMap]", fe = "[object ArrayBuffer]", B = "[object DataView]", re = "[object Float32Array]", de = "[object Float64Array]", ne = "[object Int8Array]", he = "[object Int16Array]", Me = "[object Int32Array]", Ae = "[object Uint8Array]", Y = "[object Uint8ClampedArray]", Oe = "[object Uint16Array]", G = "[object Uint32Array]", $ = /[\\^$.*+?()[\]{}|]/g, He = /\w*$/, K = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, A = {};
    A[u] = A[h] = A[fe] = A[B] = A[p] = A[g] = A[re] = A[de] = A[ne] = A[he] = A[Me] = A[v] = A[E] = A[O] = A[F] = A[le] = A[Ve] = A[Ce] = A[Ae] = A[Y] = A[Oe] = A[G] = !0, A[b] = A[_] = A[te] = !1;
    var nt = typeof M == "object" && M && M.Object === Object && M, J = typeof self == "object" && self && self.Object === Object && self, k = nt || J || Function("return this")(), U = t && !t.nodeType && t, Fe = U && !0 && e && !e.nodeType && e, ot = Fe && Fe.exports === U;
    function st(r, i) {
      return r.set(i[0], i[1]), r;
    }
    function q(r, i) {
      return r.add(i), r;
    }
    function at(r, i) {
      for (var f = -1, w = r ? r.length : 0; ++f < w && i(r[f], f, r) !== !1; )
        ;
      return r;
    }
    function W(r, i) {
      for (var f = -1, w = i.length, R = r.length; ++f < w; )
        r[R + f] = i[f];
      return r;
    }
    function Be(r, i, f, w) {
      for (var R = -1, L = r ? r.length : 0; ++R < L; )
        f = i(f, r[R], R, r);
      return f;
    }
    function it(r, i) {
      for (var f = -1, w = Array(r); ++f < r; )
        w[f] = i(f);
      return w;
    }
    function ct(r, i) {
      return r == null ? void 0 : r[i];
    }
    function oe(r) {
      var i = !1;
      if (r != null && typeof r.toString != "function")
        try {
          i = !!(r + "");
        } catch {
        }
      return i;
    }
    function Ge(r) {
      var i = -1, f = Array(r.size);
      return r.forEach(function(w, R) {
        f[++i] = [R, w];
      }), f;
    }
    function Te(r, i) {
      return function(f) {
        return r(i(f));
      };
    }
    function se(r) {
      var i = -1, f = Array(r.size);
      return r.forEach(function(w) {
        f[++i] = w;
      }), f;
    }
    var ut = Array.prototype, pe = Function.prototype, ae = Object.prototype, xe = k["__core-js_shared__"], ie = function() {
      var r = /[^.]+$/.exec(xe && xe.keys && xe.keys.IE_PROTO || "");
      return r ? "Symbol(src)_1." + r : "";
    }(), Pe = pe.toString, D = ae.hasOwnProperty, _e = ae.toString, lt = RegExp(
      "^" + Pe.call(D).replace($, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), ge = ot ? k.Buffer : void 0, Ke = k.Symbol, Re = k.Uint8Array, ft = Te(Object.getPrototypeOf, Object), ye = Object.create, Ue = ae.propertyIsEnumerable, me = ut.splice, qe = Object.getOwnPropertySymbols, we = ge ? ge.isBuffer : void 0, c = Te(Object.keys, Object), d = Xe(k, "DataView"), m = Xe(k, "Map"), C = Xe(k, "Promise"), a = Xe(k, "Set"), l = Xe(k, "WeakMap"), y = Xe(Object, "create"), T = je(d), V = je(m), X = je(C), We = je(a), Ne = je(l), ze = Ke ? Ke.prototype : void 0, Le = ze ? ze.valueOf : void 0;
    function Z(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var w = r[i];
        this.set(w[0], w[1]);
      }
    }
    function Jr() {
      this.__data__ = y ? y(null) : {};
    }
    function Xr(r) {
      return this.has(r) && delete this.__data__[r];
    }
    function Zr(r) {
      var i = this.__data__;
      if (y) {
        var f = i[r];
        return f === o ? void 0 : f;
      }
      return D.call(i, r) ? i[r] : void 0;
    }
    function Qr(r) {
      var i = this.__data__;
      return y ? i[r] !== void 0 : D.call(i, r);
    }
    function en(r, i) {
      var f = this.__data__;
      return f[r] = y && i === void 0 ? o : i, this;
    }
    Z.prototype.clear = Jr, Z.prototype.delete = Xr, Z.prototype.get = Zr, Z.prototype.has = Qr, Z.prototype.set = en;
    function ce(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var w = r[i];
        this.set(w[0], w[1]);
      }
    }
    function tn() {
      this.__data__ = [];
    }
    function rn(r) {
      var i = this.__data__, f = ht(i, r);
      if (f < 0)
        return !1;
      var w = i.length - 1;
      return f == w ? i.pop() : me.call(i, f, 1), !0;
    }
    function nn(r) {
      var i = this.__data__, f = ht(i, r);
      return f < 0 ? void 0 : i[f][1];
    }
    function on(r) {
      return ht(this.__data__, r) > -1;
    }
    function sn(r, i) {
      var f = this.__data__, w = ht(f, r);
      return w < 0 ? f.push([r, i]) : f[w][1] = i, this;
    }
    ce.prototype.clear = tn, ce.prototype.delete = rn, ce.prototype.get = nn, ce.prototype.has = on, ce.prototype.set = sn;
    function Ye(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var w = r[i];
        this.set(w[0], w[1]);
      }
    }
    function an() {
      this.__data__ = {
        hash: new Z(),
        map: new (m || ce)(),
        string: new Z()
      };
    }
    function cn(r) {
      return pt(this, r).delete(r);
    }
    function un(r) {
      return pt(this, r).get(r);
    }
    function ln(r) {
      return pt(this, r).has(r);
    }
    function fn(r, i) {
      return pt(this, r).set(r, i), this;
    }
    Ye.prototype.clear = an, Ye.prototype.delete = cn, Ye.prototype.get = un, Ye.prototype.has = ln, Ye.prototype.set = fn;
    function Je(r) {
      this.__data__ = new ce(r);
    }
    function dn() {
      this.__data__ = new ce();
    }
    function hn(r) {
      return this.__data__.delete(r);
    }
    function pn(r) {
      return this.__data__.get(r);
    }
    function _n(r) {
      return this.__data__.has(r);
    }
    function gn(r, i) {
      var f = this.__data__;
      if (f instanceof ce) {
        var w = f.__data__;
        if (!m || w.length < n - 1)
          return w.push([r, i]), this;
        f = this.__data__ = new Ye(w);
      }
      return f.set(r, i), this;
    }
    Je.prototype.clear = dn, Je.prototype.delete = hn, Je.prototype.get = pn, Je.prototype.has = _n, Je.prototype.set = gn;
    function yn(r, i) {
      var f = xt(r) || Fn(r) ? it(r.length, String) : [], w = f.length, R = !!w;
      for (var L in r)
        D.call(r, L) && !(R && (L == "length" || Dn(L, w))) && f.push(L);
      return f;
    }
    function Jt(r, i, f) {
      var w = r[i];
      (!(D.call(r, i) && er(w, f)) || f === void 0 && !(i in r)) && (r[i] = f);
    }
    function ht(r, i) {
      for (var f = r.length; f--; )
        if (er(r[f][0], i))
          return f;
      return -1;
    }
    function mn(r, i) {
      return r && Xt(i, Pt(i), r);
    }
    function Ot(r, i, f, w, R, L, ue) {
      var I;
      if (w && (I = L ? w(r, R, L, ue) : w(r)), I !== void 0)
        return I;
      if (!_t(r))
        return r;
      var nr = xt(r);
      if (nr) {
        if (I = jn(r), !i)
          return Nn(r, I);
      } else {
        var Ze = Ie(r), or = Ze == _ || Ze == S;
        if (Gn(r))
          return Cn(r, i);
        if (Ze == O || Ze == u || or && !L) {
          if (oe(r))
            return L ? r : {};
          if (I = kn(or ? {} : r), !i)
            return Ln(r, mn(I, r));
        } else {
          if (!A[Ze])
            return L ? r : {};
          I = $n(r, Ze, Ot, i);
        }
      }
      ue || (ue = new Je());
      var sr = ue.get(r);
      if (sr)
        return sr;
      if (ue.set(r, I), !nr)
        var ar = f ? In(r) : Pt(r);
      return at(ar || r, function(Rt, gt) {
        ar && (gt = Rt, Rt = r[gt]), Jt(I, gt, Ot(Rt, i, f, w, gt, r, ue));
      }), I;
    }
    function wn(r) {
      return _t(r) ? ye(r) : {};
    }
    function Sn(r, i, f) {
      var w = i(r);
      return xt(r) ? w : W(w, f(r));
    }
    function bn(r) {
      return _e.call(r);
    }
    function vn(r) {
      if (!_t(r) || Mn(r))
        return !1;
      var i = rr(r) || oe(r) ? lt : K;
      return i.test(je(r));
    }
    function En(r) {
      if (!Qt(r))
        return c(r);
      var i = [];
      for (var f in Object(r))
        D.call(r, f) && f != "constructor" && i.push(f);
      return i;
    }
    function Cn(r, i) {
      if (i)
        return r.slice();
      var f = new r.constructor(r.length);
      return r.copy(f), f;
    }
    function Tt(r) {
      var i = new r.constructor(r.byteLength);
      return new Re(i).set(new Re(r)), i;
    }
    function An(r, i) {
      var f = i ? Tt(r.buffer) : r.buffer;
      return new r.constructor(f, r.byteOffset, r.byteLength);
    }
    function On(r, i, f) {
      var w = i ? f(Ge(r), !0) : Ge(r);
      return Be(w, st, new r.constructor());
    }
    function Tn(r) {
      var i = new r.constructor(r.source, He.exec(r));
      return i.lastIndex = r.lastIndex, i;
    }
    function xn(r, i, f) {
      var w = i ? f(se(r), !0) : se(r);
      return Be(w, q, new r.constructor());
    }
    function Pn(r) {
      return Le ? Object(Le.call(r)) : {};
    }
    function Rn(r, i) {
      var f = i ? Tt(r.buffer) : r.buffer;
      return new r.constructor(f, r.byteOffset, r.length);
    }
    function Nn(r, i) {
      var f = -1, w = r.length;
      for (i || (i = Array(w)); ++f < w; )
        i[f] = r[f];
      return i;
    }
    function Xt(r, i, f, w) {
      f || (f = {});
      for (var R = -1, L = i.length; ++R < L; ) {
        var ue = i[R], I = void 0;
        Jt(f, ue, I === void 0 ? r[ue] : I);
      }
      return f;
    }
    function Ln(r, i) {
      return Xt(r, Zt(r), i);
    }
    function In(r) {
      return Sn(r, Pt, Zt);
    }
    function pt(r, i) {
      var f = r.__data__;
      return Vn(i) ? f[typeof i == "string" ? "string" : "hash"] : f.map;
    }
    function Xe(r, i) {
      var f = ct(r, i);
      return vn(f) ? f : void 0;
    }
    var Zt = qe ? Te(qe, Object) : qn, Ie = bn;
    (d && Ie(new d(new ArrayBuffer(1))) != B || m && Ie(new m()) != v || C && Ie(C.resolve()) != z || a && Ie(new a()) != le || l && Ie(new l()) != te) && (Ie = function(r) {
      var i = _e.call(r), f = i == O ? r.constructor : void 0, w = f ? je(f) : void 0;
      if (w)
        switch (w) {
          case T:
            return B;
          case V:
            return v;
          case X:
            return z;
          case We:
            return le;
          case Ne:
            return te;
        }
      return i;
    });
    function jn(r) {
      var i = r.length, f = r.constructor(i);
      return i && typeof r[0] == "string" && D.call(r, "index") && (f.index = r.index, f.input = r.input), f;
    }
    function kn(r) {
      return typeof r.constructor == "function" && !Qt(r) ? wn(ft(r)) : {};
    }
    function $n(r, i, f, w) {
      var R = r.constructor;
      switch (i) {
        case fe:
          return Tt(r);
        case p:
        case g:
          return new R(+r);
        case B:
          return An(r, w);
        case re:
        case de:
        case ne:
        case he:
        case Me:
        case Ae:
        case Y:
        case Oe:
        case G:
          return Rn(r, w);
        case v:
          return On(r, w, f);
        case E:
        case Ve:
          return new R(r);
        case F:
          return Tn(r);
        case le:
          return xn(r, w, f);
        case Ce:
          return Pn(r);
      }
    }
    function Dn(r, i) {
      return i = i ?? s, !!i && (typeof r == "number" || rt.test(r)) && r > -1 && r % 1 == 0 && r < i;
    }
    function Vn(r) {
      var i = typeof r;
      return i == "string" || i == "number" || i == "symbol" || i == "boolean" ? r !== "__proto__" : r === null;
    }
    function Mn(r) {
      return !!ie && ie in r;
    }
    function Qt(r) {
      var i = r && r.constructor, f = typeof i == "function" && i.prototype || ae;
      return r === f;
    }
    function je(r) {
      if (r != null) {
        try {
          return Pe.call(r);
        } catch {
        }
        try {
          return r + "";
        } catch {
        }
      }
      return "";
    }
    function Hn(r) {
      return Ot(r, !0, !0);
    }
    function er(r, i) {
      return r === i || r !== r && i !== i;
    }
    function Fn(r) {
      return Bn(r) && D.call(r, "callee") && (!Ue.call(r, "callee") || _e.call(r) == u);
    }
    var xt = Array.isArray;
    function tr(r) {
      return r != null && Kn(r.length) && !rr(r);
    }
    function Bn(r) {
      return Un(r) && tr(r);
    }
    var Gn = we || Wn;
    function rr(r) {
      var i = _t(r) ? _e.call(r) : "";
      return i == _ || i == S;
    }
    function Kn(r) {
      return typeof r == "number" && r > -1 && r % 1 == 0 && r <= s;
    }
    function _t(r) {
      var i = typeof r;
      return !!r && (i == "object" || i == "function");
    }
    function Un(r) {
      return !!r && typeof r == "object";
    }
    function Pt(r) {
      return tr(r) ? yn(r) : En(r);
    }
    function qn() {
      return [];
    }
    function Wn() {
      return !1;
    }
    e.exports = Hn;
  }(dt, dt.exports)), dt.exports;
}
var go = _o();
const dr = /* @__PURE__ */ Gt(go), yo = De({
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
    const o = P(), s = po(dr(Se(e.data)), Se(e.readonly)), u = Bt(), { data: h, processing: p, readonly: g, errors: b, touched: _ } = s;
    function S() {
      o.value.dispatchEvent(new SubmitEvent("submit"));
    }
    function v() {
      if (e.onSubmit)
        return e.onSubmit(h.value, s);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return u.dispatch(e.method, e.action, { data: h.value });
    }
    function E(O) {
      O.preventDefault(), O.stopPropagation();
      let z = g.value;
      p.value = !0, g.value = !0, b.value = {}, _.value = {}, be(() => v().catch((F) => {
        F instanceof St && (b.value = F.errors);
      }).finally(() => {
        p.value = !1, g.value = z;
      }));
    }
    return ir(() => e.data, (O) => {
      h.value = dr(Se(O));
    }), ir(() => e.readonly, (O) => {
      g.value = Se(O);
    }), n({
      ctx: s,
      submit: S
    }), N(Kt, s), () => Ee("form", {
      ref: (O) => o.value = O,
      action: e.action,
      method: e.method,
      novalidate: !0,
      onSubmit: E
    }, t.default({
      data: h.value,
      processing: p.value,
      errors: b.value,
      touched: _.value,
      ctx: s,
      submit: S
    }));
  }
}), Ar = Symbol("ViewResolver"), Ut = Symbol("StackedView"), qt = Symbol("StackedViewDepth"), Or = Symbol("StackedViewParent"), Tr = Symbol("StackedViewLocation"), xr = Symbol("StackedViewQuery");
function mo(e) {
  return Array.isArray(e) ? e : [e];
}
function wo() {
  const e = j(Ar);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function So() {
  const e = j(Ut);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function bo() {
  const e = j(qt);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const Pr = De({
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
    const n = wo(), o = bo(), s = So(), u = ee(() => {
      var g;
      return (g = s.value) == null ? void 0 : g.location;
    }), h = ee(() => {
      var g;
      return (g = s.value) == null ? void 0 : g.query;
    }), p = ee(() => {
      if (s.value && s.value.child)
        return { ...s.value.child, parent: s.value };
    });
    return N(Ut, p), N(qt, ee(() => o.value + 1)), N(Or, ee(() => {
      var g;
      return (g = s.value) == null ? void 0 : g.parent;
    })), N(Tr, u), N(xr, h), () => {
      if (s.value && "component" in s.value) {
        let g = n(s.value.component), b = s.value.props;
        g.inheritAttrs = !!g.inheritAttrs;
        let _ = Ee(g, b);
        return e.allowLayouts && g.layout && (_ = mo(g.layout).concat(_).reverse().reduce((S, v) => (v = typeof v == "string" ? n(v) : v, v.inheritAttrs = !!v.inheritAttrs, Ee(v, b, () => S)))), _;
      }
      if (t.default)
        return t.default();
    };
  }
}), vo = De({
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
    const o = oo(), s = Bt(), u = P(!1), h = ee(() => {
      var O;
      let _ = o.value.replace(/\/$/, ""), S = (O = e.href) == null ? void 0 : O.replace(/\/$/, ""), v = _ === S, E = !e.explicit && S && o.value.startsWith(S);
      return v || E;
    }), p = ee(() => e.href ? "a" : "button"), g = ee(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function b(_) {
      if (!e.href || !Eo(_, e.href, e.target) || (_.preventDefault(), e.disabled))
        return;
      let { method: S, href: v, data: E, preserveScroll: O, replace: z } = e;
      u.value = !0, be(() => {
        s.dispatch(S, v, { data: E, preserveScroll: O, replace: z }).then(() => {
          u.value = !1;
        }).catch(() => {
          u.value = !1;
        });
      });
    }
    return () => Ee(
      p.value,
      {
        href: e.href,
        onClick: b,
        ...g.value,
        ...t,
        class: [{ active: h.value, pending: u.value, disabled: e.disabled }]
      },
      // @ts-ignore
      n.default({ active: h, pending: u })
    );
  }
});
function Eo(e, t, n) {
  return n === "_blank" || Co(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function Co(e) {
  try {
    let t = window.location.host, n = new URL(e).host;
    return t !== n;
  } catch {
    return !1;
  }
}
const Rr = Symbol("ToastRegistry");
function Nr() {
  let e = j(Rr);
  if (!e)
    throw new Error("Toasts are used out of router context!");
  return e;
}
const Ao = De({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Nr();
    return () => Ee("div", n, t.default({ toasts: o.value }));
  }
}), Oo = De({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Nr(), s = P();
    function u() {
      clearTimeout(s.value), o.value = o.value.filter((h) => h.id !== e.toast.id);
    }
    return Mt(() => {
      s.value = setTimeout(() => u(), e.toast.duration * 1e3);
    }), Ht(() => {
      clearTimeout(s.value);
    }), () => Ee("li", n, t.default({ toast: e.toast, close: u }));
  }
}), To = De({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Bt(), s = P(), u = P(!1);
    function h(b) {
      s.value = b, u.value = !0;
    }
    async function p(b) {
      let { method: _, url: S, options: v } = s.value;
      return await o.post(e.action, b).then(async () => await o.dispatch(_, S, v).then(async (E) => (g(), await be(() => E))));
    }
    function g() {
      u.value = !1, s.value = void 0;
    }
    return Mt(() => {
      $t.addEventListener("password.confirm", h);
    }), Ht(() => {
      $t.removeEventListener("password.confirm", h);
    }), () => Ee("div", n, t.default({ open: u.value, submit: p, cancel: g }));
  }
});
function xo(e, t) {
  return Ir(Lr(e), t);
}
function Po(e, t, n) {
  return Ir(Ro(Lr(e), t), n);
}
function Lr(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function Ro(e, t) {
  let n = e.split("|"), o = No(n, t);
  if (o)
    return o.trim();
  n = Io(n);
  let s = jo(t);
  return n.length === 1 || n[s] == null ? n[0] : n[s];
}
function No(e, t) {
  for (let n in e) {
    let o = Lo(n, t);
    if (o)
      return o;
  }
}
function Lo(e, t) {
  const n = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s, o = e.match(n);
  if (!o || o.length !== 3)
    return null;
  const s = o[1], u = o[2];
  if (s.includes(",")) {
    const [h, p] = s.split(",", 2);
    if (p === "*" && t >= Number(h))
      return u;
    if (h === "*" && t <= Number(p))
      return u;
    if (t >= Number(h) && t <= Number(p))
      return u;
  }
  return Number(s) == t ? u : null;
}
function Io(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function Ir(e, t) {
  return t ? Object.keys(t).reduce((n, o) => n.replace(`:${o}`, t[o].toString()), e) : e;
}
function jo(e) {
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
function jr(e, t, n, o) {
  const s = new URL(e, o || APP_URL);
  return t && ko(s.searchParams, t), n && (s.hash = n), s.toString();
}
function ko(e, t) {
  Object.keys(t).forEach((n) => {
    Dt(e, n, ke(t[n]));
  });
}
function Dt(e, t, n, o) {
  return o && (t = o + "[" + t + "]"), n == null ? (e.append(t, ""), e) : Array.isArray(n) ? (n.forEach((s, u) => {
    Dt(e, u.toString(), s, t);
  }), e) : typeof n == "object" ? (Object.keys(n).forEach((s) => {
    Dt(e, s, n[s], t);
  }), e) : (typeof n == "boolean" && (n = Number(n)), n == null && (n = ""), e.append(t, n), e);
}
function $o(e, t = {}, n) {
  return Vo(Do(e), t, n);
}
function Do(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Vo(e, t, n) {
  const o = APP_ROUTES[e];
  if (!o)
    throw new Error(`Undefined route: ${e}`);
  const s = Mo(o, t), u = Object.keys(t).reduce((h, p) => (o.params.includes(p) || (h[p] = ke(t[p])), h), {});
  return jr(s, u, n, o.domain);
}
function Mo(e, t) {
  return e.params.reduce((n, o) => {
    let s = e.binding[o] || "id", u = ke(t[o]);
    if (typeof u == "object" && (u = u[s]), !u)
      throw new Error(`Parameter ${o} is required for uri ${e.uri}.`);
    return n.replace(new RegExp(`{${o}??}`), u);
  }, e.uri);
}
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function At(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Ho = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const bt = () => {
}, Fo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Wt = Array.isArray, tt = (e) => typeof e == "function", H = (e) => typeof e == "string", zt = (e) => e !== null && typeof e == "object", vt = (e) => (zt(e) || tt(e)) && tt(e.then) && tt(e.catch), Bo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Go = /\B([A-Z])/g, Ko = Bo(
  (e) => e.replace(Go, "-$1").toLowerCase()
);
let hr;
const Uo = () => hr || (hr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function kr(e) {
  if (Wt(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = H(o) ? Yo(o) : kr(o);
      if (s)
        for (const u in s)
          t[u] = s[u];
    }
    return t;
  } else if (H(e) || zt(e))
    return e;
}
const qo = /;(?![^(]*\))/g, Wo = /:([^]+)/, zo = /\/\*[^]*?\*\//g;
function Yo(e) {
  const t = {};
  return e.replace(zo, "").split(qo).forEach((n) => {
    if (n) {
      const o = n.split(Wo);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function Jo(e) {
  if (!e) return "";
  if (H(e)) return e;
  let t = "";
  for (const n in e) {
    const o = e[n];
    if (H(o) || typeof o == "number") {
      const s = n.startsWith("--") ? n : Ko(n);
      t += `${s}:${o};`;
    }
  }
  return t;
}
function $r(e) {
  let t = "";
  if (H(e))
    t = e;
  else if (Wt(e))
    for (let n = 0; n < e.length; n++) {
      const o = $r(e[n]);
      o && (t += o + " ");
    }
  else if (zt(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Xo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Zo = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Qo = /* @__PURE__ */ At(Xo), es = /* @__PURE__ */ At(Zo), ts = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", rs = /* @__PURE__ */ At(
  ts + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function ns(e) {
  return !!e || e === "";
}
const os = /[>/="'\u0009\u000a\u000c\u0020]/, It = {};
function ss(e) {
  if (It.hasOwnProperty(e))
    return It[e];
  const t = os.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), It[e] = !t;
}
const as = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function is(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const cs = /["'&<>]/;
function ve(e) {
  const t = "" + e, n = cs.exec(t);
  if (!n)
    return t;
  let o = "", s, u, h = 0;
  for (u = n.index; u < t.length; u++) {
    switch (t.charCodeAt(u)) {
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
    h !== u && (o += t.slice(h, u)), h = u + 1, o += s;
  }
  return h !== u ? o + t.slice(h, u) : o;
}
const us = /^-?>|<!--|-->|--!>|<!-$/g;
function ls(e) {
  return e.replace(us, "");
}
/**
* @vue/server-renderer v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const fs = /* @__PURE__ */ At(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function ds(e, t) {
  let n = "";
  for (const o in e) {
    if (fs(o) || Fo(o) || t === "textarea" && o === "value")
      continue;
    const s = e[o];
    o === "class" ? n += ` class="${ps(s)}"` : o === "style" ? n += ` style="${_s(s)}"` : o === "className" ? n += ` class="${String(s)}"` : n += hs(o, s, t);
  }
  return n;
}
function hs(e, t, n) {
  if (!is(t))
    return "";
  const o = n && (n.indexOf("-") > 0 || Qo(n)) ? e : as[e] || e.toLowerCase();
  return rs(o) ? ns(t) ? ` ${o}` : "" : ss(o) ? t === "" ? ` ${o}` : ` ${o}="${ve(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${o}`
  ), "");
}
function ps(e) {
  return ve($r(e));
}
function _s(e) {
  if (!e)
    return "";
  if (H(e))
    return ve(e);
  const t = kr(e);
  return ve(Jo(t));
}
const { ensureValidVNode: Xs } = Ct;
function gs(e, t, n, o, s) {
  e("<!--teleport start-->");
  const u = s.appContext.provides[mr], h = u.__teleportBuffers || (u.__teleportBuffers = {}), p = h[n] || (h[n] = []), g = p.length;
  let b;
  if (o)
    t(e), b = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: _, push: S } = Ur();
    S("<!--teleport start anchor-->"), t(S), S("<!--teleport anchor-->"), b = _();
  }
  p.splice(g, 0, b), e("<!--teleport end-->");
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
function Vt(e) {
  const t = e && e.__v_raw;
  return t ? Vt(t) : e;
}
function ys(e) {
  return e ? e.__v_isRef === !0 : !1;
}
const $e = [];
function ms(e) {
  $e.push(e);
}
function ws() {
  $e.pop();
}
let jt = !1;
function Dr(e, ...t) {
  if (jt) return;
  jt = !0;
  const n = $e.length ? $e[$e.length - 1].component : null, o = n && n.appContext.config.warnHandler, s = Ss();
  if (o)
    Hr(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((u) => {
          var h, p;
          return (p = (h = u.toString) == null ? void 0 : h.call(u)) != null ? p : JSON.stringify(u);
        }).join(""),
        n && n.proxy,
        s.map(
          ({ vnode: u }) => `at <${Br(n, u.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const u = [`[Vue warn]: ${e}`, ...t];
    s.length && u.push(`
`, ...bs(s)), console.warn(...u);
  }
  jt = !1;
}
function Ss() {
  let e = $e[$e.length - 1];
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
function bs(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...vs(n));
  }), t;
}
function vs({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, s = ` at <${Br(
    e.component,
    e.type,
    o
  )}`, u = ">" + n;
  return e.props ? [s, ...Es(e.props), u] : [s + u];
}
function Es(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Vr(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Vr(e, t, n) {
  return H(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : ys(t) ? (t = Vr(e, Vt(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : tt(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = Vt(t), n ? t : [`${e}=`, t]);
}
const Mr = {
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
function Hr(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (s) {
    Cs(s, t, n);
  }
}
function Cs(e, t, n, o = !0) {
  const s = t ? t.vnode : null, { errorHandler: u, throwUnhandledErrorInProduction: h } = t && t.appContext.config || Ho;
  if (t) {
    let p = t.parent;
    const g = t.proxy, b = process.env.NODE_ENV !== "production" ? Mr[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; p; ) {
      const _ = p.ec;
      if (_) {
        for (let S = 0; S < _.length; S++)
          if (_[S](e, g, b) === !1)
            return;
      }
      p = p.parent;
    }
    if (u) {
      Hr(u, null, 10, [
        e,
        g,
        b
      ]);
      return;
    }
  }
  As(e, n, s, o, h);
}
function As(e, t, n, o = !0, s = !1) {
  if (process.env.NODE_ENV !== "production") {
    const u = Mr[t];
    if (n && ms(n), Dr(`Unhandled error${u ? ` during execution of ${u}` : ""}`), n && ws(), o)
      throw e;
    console.error(e);
  } else {
    if (s)
      throw e;
    console.error(e);
  }
}
let Qe, yt = [];
function Fr(e, t) {
  var n, o;
  Qe = e, Qe ? (Qe.enabled = !0, yt.forEach(({ event: s, args: u }) => Qe.emit(s, ...u)), yt = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((o = (n = window.navigator) == null ? void 0 : n.userAgent) != null && o.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((u) => {
    Fr(u, t);
  }), setTimeout(() => {
    Qe || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, yt = []);
  }, 3e3)) : yt = [];
}
{
  const e = Uo(), t = (n, o) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(o), (u) => {
      s.length > 1 ? s.forEach((h) => h(u)) : s[0](u);
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
const Os = /(?:^|[-_])(\w)/g, Ts = (e) => e.replace(Os, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function xs(e, t = !0) {
  return tt(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Br(e, t, n = !1) {
  let o = xs(t);
  if (!o && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (o = s[1]);
  }
  if (!o && e && e.parent) {
    const s = (u) => {
      for (const h in u)
        if (u[h] === t)
          return h;
    };
    o = s(
      e.components || e.parent.type.components
    ) || s(e.appContext.components);
  }
  return o ? Ts(o) : n ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function Ps(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: Rs,
  setCurrentRenderingInstance: pr,
  setupComponent: Ns,
  renderComponentRoot: _r,
  normalizeVNode: Ls,
  pushWarningContext: Gr,
  popWarningContext: Kr
} = Ct;
function Ur() {
  let e = !1;
  const t = [];
  return {
    getBuffer() {
      return t;
    },
    push(n) {
      const o = H(n);
      if (e && o) {
        t[t.length - 1] += n;
        return;
      }
      t.push(n), e = o, (vt(n) || Wt(n) && n.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function qr(e, t = null, n) {
  const o = e.component = Rs(
    e,
    t,
    null
  );
  process.env.NODE_ENV !== "production" && Gr(e);
  const s = Ns(
    o,
    !0
    /* isSSR */
  );
  process.env.NODE_ENV !== "production" && Kr();
  const u = vt(s);
  let h = o.sp;
  return u || h ? Promise.resolve(s).then(() => {
    if (u && (h = o.sp), h)
      return Promise.all(
        h.map((g) => g.call(o.proxy))
      );
  }).catch(bt).then(() => gr(o, n)) : gr(o, n);
}
function gr(e, t) {
  process.env.NODE_ENV !== "production" && Gr(e.vnode);
  const n = e.type, { getBuffer: o, push: s } = Ur();
  if (tt(n)) {
    let u = _r(e);
    if (!n.props)
      for (const h in e.attrs)
        h.startsWith("data-v-") && ((u.props || (u.props = {}))[h] = "");
    Et(s, e.subTree = u, e, t);
  } else {
    (!e.render || e.render === bt) && !e.ssrRender && !n.ssrRender && H(n.template) && (n.ssrRender = Ps(n.template));
    const u = e.ssrRender || n.ssrRender;
    if (u) {
      let h = e.inheritAttrs !== !1 ? e.attrs : void 0, p = !1, g = e;
      for (; ; ) {
        const _ = g.vnode.scopeId;
        _ && (p || (h = { ...h }, p = !0), h[_] = "");
        const S = g.parent;
        if (S && S.subTree && S.subTree === g.vnode)
          g = S;
        else
          break;
      }
      if (t) {
        p || (h = { ...h });
        const _ = t.trim().split(" ");
        for (let S = 0; S < _.length; S++)
          h[_[S]] = "";
      }
      const b = pr(e);
      try {
        u(
          e.proxy,
          s,
          e,
          h,
          // compiler-optimized bindings
          e.props,
          e.setupState,
          e.data,
          e.ctx
        );
      } finally {
        pr(b);
      }
    } else if (e.render && e.render !== bt)
      Et(
        s,
        e.subTree = _r(e),
        e,
        t
      );
    else {
      const h = n.name || n.__file || "<Anonymous>";
      wt(`Component ${h} is missing template or render function.`), s("<!---->");
    }
  }
  return process.env.NODE_ENV !== "production" && Kr(), o();
}
function Et(e, t, n, o) {
  const { type: s, shapeFlag: u, children: h, dirs: p, props: g } = t;
  switch (p && (t.props = js(t, g, p)), s) {
    case ro:
      e(ve(h));
      break;
    case to:
      e(
        h ? `<!--${ls(h)}-->` : "<!---->"
      );
      break;
    case eo:
      e(h);
      break;
    case Qn:
      t.slotScopeIds && (o = (o ? o + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), Yt(
        e,
        h,
        n,
        o
      ), e("<!--]-->");
      break;
    default:
      u & 1 ? Is(e, t, n, o) : u & 6 ? e(qr(t, n, o)) : u & 64 ? ks(e, t, n, o) : u & 128 ? Et(e, t.ssContent, n, o) : wt(
        "[@vue/server-renderer] Invalid VNode type:",
        s,
        `(${typeof s})`
      );
  }
}
function Yt(e, t, n, o) {
  for (let s = 0; s < t.length; s++)
    Et(e, Ls(t[s]), n, o);
}
function Is(e, t, n, o) {
  const s = t.type;
  let { props: u, children: h, shapeFlag: p, scopeId: g } = t, b = `<${s}`;
  u && (b += ds(u, s)), g && (b += ` ${g}`);
  let _ = n, S = t;
  for (; _ && S === _.subTree; )
    S = _.vnode, S.scopeId && (b += ` ${S.scopeId}`), _ = _.parent;
  if (o && (b += ` ${o}`), e(b + ">"), !es(s)) {
    let v = !1;
    u && (u.innerHTML ? (v = !0, e(u.innerHTML)) : u.textContent ? (v = !0, e(ve(u.textContent))) : s === "textarea" && u.value && (v = !0, e(ve(u.value)))), v || (p & 8 ? e(ve(h)) : p & 16 && Yt(
      e,
      h,
      n,
      o
    )), e(`</${s}>`);
  }
}
function js(e, t, n) {
  const o = [];
  for (let s = 0; s < n.length; s++) {
    const u = n[s], {
      dir: { getSSRProps: h }
    } = u;
    if (h) {
      const p = h(u, e);
      p && o.push(p);
    }
  }
  return no(t || {}, ...o);
}
function ks(e, t, n, o) {
  const s = t.props && t.props.to, u = t.props && t.props.disabled;
  if (!s)
    return u || wt("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!H(s))
    return wt(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  gs(
    e,
    (h) => {
      Yt(
        h,
        t.children,
        n,
        o
      );
    },
    s,
    u || u === "",
    n
  );
}
const { isVNode: $s } = Ct;
function mt(e, t, n) {
  if (!e.hasAsync)
    return t + zr(e);
  let o = t;
  for (let s = n; s < e.length; s += 1) {
    const u = e[s];
    if (H(u)) {
      o += u;
      continue;
    }
    if (vt(u))
      return u.then((p) => (e[s] = p, mt(e, o, s)));
    const h = mt(u, o, 0);
    if (vt(h))
      return h.then((p) => (e[s] = p, mt(e, "", s)));
    o = h;
  }
  return o;
}
function Wr(e) {
  return mt(e, "", 0);
}
function zr(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) {
    let o = e[n];
    H(o) ? t += o : t += zr(o);
  }
  return t;
}
async function Yr(e, t = {}) {
  if ($s(e))
    return Yr(Xn({ render: () => e }), t);
  const n = Zn(e._component, e._props);
  n.appContext = e._context, e.provide(mr, t);
  const o = await qr(n), s = await Wr(o);
  if (await Ds(t), t.__watcherHandles)
    for (const u of t.__watcherHandles)
      u();
  return s;
}
async function Ds(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await Wr(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
const { isVNode: Zs } = Ct;
Jn();
const Vs = De({
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
    const t = P(e.state.abilities), n = P(e.state.authenticated), o = P(e.state.location), s = P(e.state.stack), u = P(e.state.signature), h = P(e.state.toasts);
    function p() {
      return {
        location: ke(Se(o)),
        signature: ke(Se(u)),
        stack: ke(Se(s))
      };
    }
    async function g(_) {
      return t.value = _.abilities, n.value = _.authenticated, _.location && (o.value = _.location), _.signature && (u.value = _.signature), _.stack && (s.value = Cr(ke(Se(s.value)), _.stack)), _.toasts && _.toasts.length > 0 && (h.value = [...h.value, ..._.toasts]), await be(() => p());
    }
    N(vr, t), N(br, n), N(wr, o), N(Sr, u), N(Er, g), N(Ar, e.resolver), N(qt, ee(() => 0)), N(Ut, s), N(Rr, h);
    function b(_) {
      _.state ? (o.value = _.state.location, s.value = _.state.stack, u.value = _.state.signature) : (window.history.replaceState(p(), "", o.value), window.scroll(0, 0));
    }
    return Mt(() => {
      window.history.replaceState(p(), "", o.value), window.addEventListener("popstate", b);
    }), Ht(() => {
      window.removeEventListener("popstate", b);
    }), () => Ee(Pr);
  }
});
async function Qs({ initial: e, resolver: t, setup: n }) {
  const o = typeof window > "u", s = e || Ms(), u = n({ router: Vs, props: { resolver: t, state: s } });
  return o ? await Yr(u) : "";
}
function Ms() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
const et = P();
async function yr(e, t) {
  return new Promise((n, o) => {
    function s() {
      et.value.processing = !0, be(() => {
        Promise.resolve(t()).then((h) => {
          et.value = void 0, be(() => n(h));
        }).catch((h) => {
          et.value = void 0, be(() => o(h));
        });
      });
    }
    function u() {
      et.value = void 0, be(() => o());
    }
    et.value = { ...e, processing: !1, confirm: s, cancel: u };
  });
}
async function Hs(e, t) {
  return t !== void 0 ? yr(e, t) : yr({}, e);
}
function ea() {
  return et;
}
function ta() {
  return Hs;
}
function ra() {
  return P();
}
function na() {
  return j(Kt, null);
}
function oa() {
  let e = j(Kt);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function sa() {
  const e = j(Tr);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function Fs() {
  const e = j(Or);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function aa() {
  const e = Fs();
  return ee(() => {
    if (e && e.value && e.value.location)
      return jr(e.value.location, e.value.query);
  });
}
function ia() {
  const e = j(xr);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function Bs(e) {
  return e ? APP_COUNTRIES_IMPLICITLY_ADDRESSES.includes(e) : !1;
}
function ca(e) {
  return !Bs(e);
}
function Gs(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function ua(e) {
  return !Gs(e);
}
function la(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function fa(e) {
  return e.filter((t) => t.parentId === null);
}
function da(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right && n.parentId === t.id);
}
function ha(e, t) {
  return e.filter((n) => n.left < t.left && n.right > t.right);
}
function pa(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right);
}
var Ks = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Ks || {});
function _a() {
  return {
    install(e) {
      e.component("RouterView", Pr), e.component("RouterLink", vo), e.component("FormController", yo), e.component("ToastController", Ao), e.component("PasswordConfirmationController", To), e.component("Toast", Oo), e.config.globalProperties.$t = xo, e.config.globalProperties.$tc = Po, e.config.globalProperties.$route = $o;
    }
  };
}
export {
  St as CompleteResponse,
  io as ErrorModal,
  $t as EventBus,
  Kt as FormContextInjectionKey,
  yo as FormControllerComponent,
  Ft as Request,
  kt as Response,
  Vs as RouterComponent,
  vo as RouterLinkComponent,
  Pr as RouterViewComponent,
  qt as StackedViewDepthInjectionKey,
  Ut as StackedViewInjectionKey,
  Tr as StackedViewLocationInjectionKey,
  Or as StackedViewParentInjectionKey,
  xr as StackedViewQueryInjectionKey,
  Ar as StackedViewResolverInjectionKey,
  vr as StateAbilities,
  br as StateAuthenticated,
  wr as StateLocationInjectionKey,
  Er as StateManagerInjectionKey,
  Sr as StateStackSignatureInjectionKey,
  Oo as ToastComponent,
  Ao as ToastControllerComponent,
  Ks as ToastKind,
  Rr as ToastRegistryInjectionKey,
  Gs as blank,
  po as createFormContext,
  Qs as createFoundationController,
  _a as createOtherSoftwareFoundation,
  ua as filled,
  Js as getModelFromContext,
  la as hash,
  ca as isCountryExplicit,
  Bs as isCountryImplicit,
  ha as nestedSetAncestors,
  da as nestedSetChildren,
  pa as nestedSetDescendants,
  fa as nestedSetRoot,
  $o as route,
  Ys as setModelWithContext,
  xo as trans,
  Po as transChoice,
  Cr as updateStack,
  jr as url,
  Ws as useAbilities,
  zs as useAuthenticated,
  ta as useConfirmation,
  ea as useCurrentConfirmation,
  ra as useFormApi,
  na as useFormContext,
  Bt as useHttpClient,
  oo as useLocation,
  oa as usePersistentFormContext,
  so as useStackSignature,
  ao as useStateManager,
  Nr as useToasts,
  bo as useViewDepth,
  sa as useViewLocation,
  Fs as useViewParent,
  aa as useViewParentLocation,
  ia as useViewQuery,
  wo as useViewResolver,
  So as useViewStack,
  mo as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

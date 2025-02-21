var zn = Object.defineProperty;
var Yn = (e, t, n) => t in e ? zn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var T = (e, t, n) => Yn(e, typeof t != "symbol" ? t + "" : t, n);
import { inject as j, ref as R, defineComponent as Ve, toValue as Se, watch as ir, provide as N, h as Ee, nextTick as be, computed as Q, onMounted as Mt, onBeforeUnmount as Ht, toRaw as ke, ssrUtils as Ct, initDirectivesForSSR as Jn, createApp as Zn, createVNode as Xn, ssrContextKey as mr, warn as wt, Fragment as Qn, Static as eo, Comment as to, Text as ro, mergeProps as no } from "vue";
class kt {
  constructor(t) {
    T(this, "xhr");
    T(this, "status");
    T(this, "success");
    T(this, "fail");
    T(this, "partial");
    T(this, "raw");
    T(this, "message");
    T(this, "content");
    if (this.xhr = t, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
  }
}
class St extends kt {
  constructor(n) {
    super(n);
    T(this, "abilities");
    T(this, "authenticated");
    T(this, "location");
    T(this, "signature");
    T(this, "redirect");
    T(this, "stack");
    T(this, "toasts");
    T(this, "errors");
    let o = JSON.parse(this.xhr.response);
    this.abilities = o.abilities, this.authenticated = o.authenticated, this.location = o.location, this.signature = o.signature, this.redirect = o.redirect, this.stack = o.stack, this.errors = o.errors, this.toasts = o.toasts;
  }
}
const wr = Symbol("StateLocation"), Sr = Symbol("StateStackSignature"), br = Symbol("StateAuthenticated"), vr = Symbol("StateAbilities"), Er = Symbol("StateManager");
function qs() {
  let e = j(vr);
  if (!e)
    throw new Error("Abilities are used out of router context!");
  return e;
}
function Ws() {
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
  constructor(t, n, o = void 0, a = void 0) {
    T(this, "method");
    T(this, "url");
    T(this, "xhr");
    T(this, "body");
    T(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = n, this.body = o, this.signature = a;
  }
  static send(t, n, o = void 0, a = void 0) {
    return new Ft(t, n, o, a).send();
  }
  send() {
    return new Promise((t, n) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
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
}, X = {}, $t = {
  addEventListener(e, t) {
    X[e] ? X[e].push(t) : X[e] = [t];
  },
  removeEventListener(e, t) {
    X[e] && (X[e] = X[e].filter((n) => n !== t), X[e].length === 0 && delete X[e]);
  },
  dispatch(e, t) {
    return X[e] && X[e].forEach((n) => n(t)), t;
  }
};
function Bt() {
  const e = ao(), t = so();
  async function n(h, S, { data: b = void 0, preserveScroll: _ = !1, replace: w = !1 } = {}) {
    return document.body.classList.add("osf-loading"), await Ft.send(h, S, b, t.value).then(async (v) => await e.update(v).then((x) => v.redirect ? p(v.redirect) : v.raw ? Promise.resolve(v.raw) : (_ || u(), w ? a(x) : o(x), Promise.resolve(v)))).catch(async (v) => v instanceof St ? await e.update(v).then(() => Promise.reject(v)) : v.status === 423 ? ($t.dispatch("password.confirm", { method: h, url: S, options: { data: b, preserveScroll: _, replace: w } }), Promise.reject(v)) : (console.error(v), APP_DEBUG && v.content && io.show(v.content), Promise.reject(v))).finally(() => {
      document.body.classList.remove("osf-loading");
    });
  }
  function o(h) {
    window.history.pushState(h, "", h.location);
  }
  function a(h) {
    window.history.replaceState(h, "", h.location);
  }
  function u() {
    window.scroll(0, 0);
  }
  async function p(h) {
    return h.reload ? await new Promise(() => {
      window.location.href = h.target;
    }) : await n("GET", h.target, {
      preserveScroll: !0,
      replace: !1
    });
  }
  return {
    dispatch: n,
    get: async function(h) {
      return await n("GET", h);
    },
    post: async function(h, S = void 0) {
      return await n("POST", h, { data: S, preserveScroll: !0 });
    },
    patch: async function(h, S = void 0) {
      return await n("PATCH", h, { data: S, preserveScroll: !0 });
    },
    put: async function(h, S = void 0) {
      return await n("PUT", h, { data: S, preserveScroll: !0 });
    },
    delete: async function(h, S = void 0) {
      return await n("DELETE", h, { data: S, preserveScroll: !0 });
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
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = 9007199254740991, o = "[object Function]", a = "[object GeneratorFunction]", u = "[object Symbol]", p = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, h = /^\w*$/, S = /^\./, b = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, _ = /[\\^$.*+?()[\]{}|]/g, w = /\\(\\)?/g, v = /^\[object .+?Constructor\]$/, x = /^(?:0|[1-9]\d*)$/, O = typeof M == "object" && M && M.Object === Object && M, F = typeof self == "object" && self && self.Object === Object && self, ue = O || F || Function("return this")();
  function le(s, l) {
    return s == null ? void 0 : s[l];
  }
  function De(s) {
    var l = !1;
    if (s != null && typeof s.toString != "function")
      try {
        l = !!(s + "");
      } catch {
      }
    return l;
  }
  var Ce = Array.prototype, ee = Function.prototype, fe = Object.prototype, B = ue["__core-js_shared__"], te = function() {
    var s = /[^.]+$/.exec(B && B.keys && B.keys.IE_PROTO || "");
    return s ? "Symbol(src)_1." + s : "";
  }(), de = ee.toString, re = fe.hasOwnProperty, he = fe.toString, Me = RegExp(
    "^" + de.call(re).replace(_, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ae = ue.Symbol, z = Ce.splice, Oe = Pe(ue, "Map"), G = Pe(Object, "create"), $ = Ae ? Ae.prototype : void 0, He = $ ? $.toString : void 0;
  function K(s) {
    var l = -1, g = s ? s.length : 0;
    for (this.clear(); ++l < g; ) {
      var A = s[l];
      this.set(A[0], A[1]);
    }
  }
  function rt() {
    this.__data__ = G ? G(null) : {};
  }
  function C(s) {
    return this.has(s) && delete this.__data__[s];
  }
  function nt(s) {
    var l = this.__data__;
    if (G) {
      var g = l[s];
      return g === t ? void 0 : g;
    }
    return re.call(l, s) ? l[s] : void 0;
  }
  function Y(s) {
    var l = this.__data__;
    return G ? l[s] !== void 0 : re.call(l, s);
  }
  function k(s, l) {
    var g = this.__data__;
    return g[s] = G && l === void 0 ? t : l, this;
  }
  K.prototype.clear = rt, K.prototype.delete = C, K.prototype.get = nt, K.prototype.has = Y, K.prototype.set = k;
  function U(s) {
    var l = -1, g = s ? s.length : 0;
    for (this.clear(); ++l < g; ) {
      var A = s[l];
      this.set(A[0], A[1]);
    }
  }
  function Fe() {
    this.__data__ = [];
  }
  function ot(s) {
    var l = this.__data__, g = oe(l, s);
    if (g < 0)
      return !1;
    var A = l.length - 1;
    return g == A ? l.pop() : z.call(l, g, 1), !0;
  }
  function st(s) {
    var l = this.__data__, g = oe(l, s);
    return g < 0 ? void 0 : l[g][1];
  }
  function q(s) {
    return oe(this.__data__, s) > -1;
  }
  function at(s, l) {
    var g = this.__data__, A = oe(g, s);
    return A < 0 ? g.push([s, l]) : g[A][1] = l, this;
  }
  U.prototype.clear = Fe, U.prototype.delete = ot, U.prototype.get = st, U.prototype.has = q, U.prototype.set = at;
  function W(s) {
    var l = -1, g = s ? s.length : 0;
    for (this.clear(); ++l < g; ) {
      var A = s[l];
      this.set(A[0], A[1]);
    }
  }
  function Be() {
    this.__data__ = {
      hash: new K(),
      map: new (Oe || U)(),
      string: new K()
    };
  }
  function it(s) {
    return ae(this, s).delete(s);
  }
  function ct(s) {
    return ae(this, s).get(s);
  }
  function ne(s) {
    return ae(this, s).has(s);
  }
  function Ge(s, l) {
    return ae(this, s).set(s, l), this;
  }
  W.prototype.clear = Be, W.prototype.delete = it, W.prototype.get = ct, W.prototype.has = ne, W.prototype.set = Ge;
  function Te(s, l, g) {
    var A = s[l];
    (!(re.call(s, l) && Ue(A, g)) || g === void 0 && !(l in s)) && (s[l] = g);
  }
  function oe(s, l) {
    for (var g = s.length; g--; )
      if (Ue(s[g][0], l))
        return g;
    return -1;
  }
  function ut(s) {
    if (!we(s) || ge(s))
      return !1;
    var l = qe(s) || De(s) ? Me : v;
    return l.test(ft(s));
  }
  function pe(s, l, g, A) {
    if (!we(s))
      return s;
    l = _e(l, s) ? [l] : xe(l);
    for (var D = -1, J = l.length, We = J - 1, Ne = s; Ne != null && ++D < J; ) {
      var ze = Re(l[D]), Le = g;
      if (D != We) {
        var Z = Ne[ze];
        Le = void 0, Le === void 0 && (Le = we(Z) ? Z : V(l[D + 1]) ? [] : {});
      }
      Te(Ne, ze, Le), Ne = Ne[ze];
    }
    return s;
  }
  function se(s) {
    if (typeof s == "string")
      return s;
    if (d(s))
      return He ? He.call(s) : "";
    var l = s + "";
    return l == "0" && 1 / s == -1 / 0 ? "-0" : l;
  }
  function xe(s) {
    return me(s) ? s : Ke(s);
  }
  function ae(s, l) {
    var g = s.__data__;
    return lt(l) ? g[typeof l == "string" ? "string" : "hash"] : g.map;
  }
  function Pe(s, l) {
    var g = le(s, l);
    return ut(g) ? g : void 0;
  }
  function V(s, l) {
    return l = l ?? n, !!l && (typeof s == "number" || x.test(s)) && s > -1 && s % 1 == 0 && s < l;
  }
  function _e(s, l) {
    if (me(s))
      return !1;
    var g = typeof s;
    return g == "number" || g == "symbol" || g == "boolean" || s == null || d(s) ? !0 : h.test(s) || !p.test(s) || l != null && s in Object(l);
  }
  function lt(s) {
    var l = typeof s;
    return l == "string" || l == "number" || l == "symbol" || l == "boolean" ? s !== "__proto__" : s === null;
  }
  function ge(s) {
    return !!te && te in s;
  }
  var Ke = ye(function(s) {
    s = y(s);
    var l = [];
    return S.test(s) && l.push(""), s.replace(b, function(g, A, D, J) {
      l.push(D ? J.replace(w, "$1") : A || g);
    }), l;
  });
  function Re(s) {
    if (typeof s == "string" || d(s))
      return s;
    var l = s + "";
    return l == "0" && 1 / s == -1 / 0 ? "-0" : l;
  }
  function ft(s) {
    if (s != null) {
      try {
        return de.call(s);
      } catch {
      }
      try {
        return s + "";
      } catch {
      }
    }
    return "";
  }
  function ye(s, l) {
    if (typeof s != "function" || l && typeof l != "function")
      throw new TypeError(e);
    var g = function() {
      var A = arguments, D = l ? l.apply(this, A) : A[0], J = g.cache;
      if (J.has(D))
        return J.get(D);
      var We = s.apply(this, A);
      return g.cache = J.set(D, We), We;
    };
    return g.cache = new (ye.Cache || W)(), g;
  }
  ye.Cache = W;
  function Ue(s, l) {
    return s === l || s !== s && l !== l;
  }
  var me = Array.isArray;
  function qe(s) {
    var l = we(s) ? he.call(s) : "";
    return l == o || l == a;
  }
  function we(s) {
    var l = typeof s;
    return !!s && (l == "object" || l == "function");
  }
  function c(s) {
    return !!s && typeof s == "object";
  }
  function d(s) {
    return typeof s == "symbol" || c(s) && he.call(s) == u;
  }
  function y(s) {
    return s == null ? "" : se(s);
  }
  function E(s, l, g) {
    return s == null ? s : pe(s, l, g);
  }
  return Nt = E, Nt;
}
var uo = co();
const ur = /* @__PURE__ */ Gt(uo);
var Lt, lr;
function lo() {
  if (lr) return Lt;
  lr = 1;
  var e = "Expected a function", t = "__lodash_hash_undefined__", n = "[object Function]", o = "[object GeneratorFunction]", a = "[object Symbol]", u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, p = /^\w*$/, h = /^\./, S = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, b = /[\\^$.*+?()[\]{}|]/g, _ = /\\(\\)?/g, w = /^\[object .+?Constructor\]$/, v = typeof M == "object" && M && M.Object === Object && M, x = typeof self == "object" && self && self.Object === Object && self, O = v || x || Function("return this")();
  function F(c, d) {
    return c == null ? void 0 : c[d];
  }
  function ue(c) {
    var d = !1;
    if (c != null && typeof c.toString != "function")
      try {
        d = !!(c + "");
      } catch {
      }
    return d;
  }
  var le = Array.prototype, De = Function.prototype, Ce = Object.prototype, ee = O["__core-js_shared__"], fe = function() {
    var c = /[^.]+$/.exec(ee && ee.keys && ee.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), B = De.toString, te = Ce.hasOwnProperty, de = Ce.toString, re = RegExp(
    "^" + B.call(te).replace(b, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), he = O.Symbol, Me = le.splice, Ae = se(O, "Map"), z = se(Object, "create"), Oe = he ? he.prototype : void 0, G = Oe ? Oe.toString : void 0;
  function $(c) {
    var d = -1, y = c ? c.length : 0;
    for (this.clear(); ++d < y; ) {
      var E = c[d];
      this.set(E[0], E[1]);
    }
  }
  function He() {
    this.__data__ = z ? z(null) : {};
  }
  function K(c) {
    return this.has(c) && delete this.__data__[c];
  }
  function rt(c) {
    var d = this.__data__;
    if (z) {
      var y = d[c];
      return y === t ? void 0 : y;
    }
    return te.call(d, c) ? d[c] : void 0;
  }
  function C(c) {
    var d = this.__data__;
    return z ? d[c] !== void 0 : te.call(d, c);
  }
  function nt(c, d) {
    var y = this.__data__;
    return y[c] = z && d === void 0 ? t : d, this;
  }
  $.prototype.clear = He, $.prototype.delete = K, $.prototype.get = rt, $.prototype.has = C, $.prototype.set = nt;
  function Y(c) {
    var d = -1, y = c ? c.length : 0;
    for (this.clear(); ++d < y; ) {
      var E = c[d];
      this.set(E[0], E[1]);
    }
  }
  function k() {
    this.__data__ = [];
  }
  function U(c) {
    var d = this.__data__, y = ne(d, c);
    if (y < 0)
      return !1;
    var E = d.length - 1;
    return y == E ? d.pop() : Me.call(d, y, 1), !0;
  }
  function Fe(c) {
    var d = this.__data__, y = ne(d, c);
    return y < 0 ? void 0 : d[y][1];
  }
  function ot(c) {
    return ne(this.__data__, c) > -1;
  }
  function st(c, d) {
    var y = this.__data__, E = ne(y, c);
    return E < 0 ? y.push([c, d]) : y[E][1] = d, this;
  }
  Y.prototype.clear = k, Y.prototype.delete = U, Y.prototype.get = Fe, Y.prototype.has = ot, Y.prototype.set = st;
  function q(c) {
    var d = -1, y = c ? c.length : 0;
    for (this.clear(); ++d < y; ) {
      var E = c[d];
      this.set(E[0], E[1]);
    }
  }
  function at() {
    this.__data__ = {
      hash: new $(),
      map: new (Ae || Y)(),
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
  function ne(c, d) {
    for (var y = c.length; y--; )
      if (Ke(c[y][0], d))
        return y;
    return -1;
  }
  function Ge(c, d) {
    d = xe(d, c) ? [d] : ut(d);
    for (var y = 0, E = d.length; c != null && y < E; )
      c = c[_e(d[y++])];
    return y && y == E ? c : void 0;
  }
  function Te(c) {
    if (!ye(c) || Pe(c))
      return !1;
    var d = ft(c) || ue(c) ? re : w;
    return d.test(lt(c));
  }
  function oe(c) {
    if (typeof c == "string")
      return c;
    if (me(c))
      return G ? G.call(c) : "";
    var d = c + "";
    return d == "0" && 1 / c == -1 / 0 ? "-0" : d;
  }
  function ut(c) {
    return Re(c) ? c : V(c);
  }
  function pe(c, d) {
    var y = c.__data__;
    return ae(d) ? y[typeof d == "string" ? "string" : "hash"] : y.map;
  }
  function se(c, d) {
    var y = F(c, d);
    return Te(y) ? y : void 0;
  }
  function xe(c, d) {
    if (Re(c))
      return !1;
    var y = typeof c;
    return y == "number" || y == "symbol" || y == "boolean" || c == null || me(c) ? !0 : p.test(c) || !u.test(c) || d != null && c in Object(d);
  }
  function ae(c) {
    var d = typeof c;
    return d == "string" || d == "number" || d == "symbol" || d == "boolean" ? c !== "__proto__" : c === null;
  }
  function Pe(c) {
    return !!fe && fe in c;
  }
  var V = ge(function(c) {
    c = qe(c);
    var d = [];
    return h.test(c) && d.push(""), c.replace(S, function(y, E, s, l) {
      d.push(s ? l.replace(_, "$1") : E || y);
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
    var y = function() {
      var E = arguments, s = d ? d.apply(this, E) : E[0], l = y.cache;
      if (l.has(s))
        return l.get(s);
      var g = c.apply(this, E);
      return y.cache = l.set(s, g), g;
    };
    return y.cache = new (ge.Cache || q)(), y;
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
    return typeof c == "symbol" || Ue(c) && de.call(c) == a;
  }
  function qe(c) {
    return c == null ? "" : oe(c);
  }
  function we(c, d, y) {
    var E = c == null ? void 0 : Ge(c, d);
    return E === void 0 ? y : E;
  }
  return Lt = we, Lt;
}
var fo = lo();
const ho = /* @__PURE__ */ Gt(fo), Kt = Symbol("FormContext");
function po(e = {}, t = !1) {
  const n = R(e), o = R({}), a = R({}), u = R(!1), p = R(t);
  function h(_) {
    ur(a.value, _, !0);
  }
  function S(_, w) {
    return ho(n.value, _, w);
  }
  function b(_, w) {
    ur(n.value, _, w);
  }
  return {
    data: n,
    errors: o,
    touched: a,
    processing: u,
    readonly: p,
    touch: h,
    value: S,
    fill: b
  };
}
function zs(e, t, n) {
  return e && t && (t.touch(e), t.fill(e, n)), n;
}
function Ys(e, t, n) {
  return e && t ? t.value(e, n) : n;
}
var dt = { exports: {} };
dt.exports;
var fr;
function _o() {
  return fr || (fr = 1, function(e, t) {
    var n = 200, o = "__lodash_hash_undefined__", a = 9007199254740991, u = "[object Arguments]", p = "[object Array]", h = "[object Boolean]", S = "[object Date]", b = "[object Error]", _ = "[object Function]", w = "[object GeneratorFunction]", v = "[object Map]", x = "[object Number]", O = "[object Object]", F = "[object Promise]", ue = "[object RegExp]", le = "[object Set]", De = "[object String]", Ce = "[object Symbol]", ee = "[object WeakMap]", fe = "[object ArrayBuffer]", B = "[object DataView]", te = "[object Float32Array]", de = "[object Float64Array]", re = "[object Int8Array]", he = "[object Int16Array]", Me = "[object Int32Array]", Ae = "[object Uint8Array]", z = "[object Uint8ClampedArray]", Oe = "[object Uint16Array]", G = "[object Uint32Array]", $ = /[\\^$.*+?()[\]{}|]/g, He = /\w*$/, K = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, C = {};
    C[u] = C[p] = C[fe] = C[B] = C[h] = C[S] = C[te] = C[de] = C[re] = C[he] = C[Me] = C[v] = C[x] = C[O] = C[ue] = C[le] = C[De] = C[Ce] = C[Ae] = C[z] = C[Oe] = C[G] = !0, C[b] = C[_] = C[ee] = !1;
    var nt = typeof M == "object" && M && M.Object === Object && M, Y = typeof self == "object" && self && self.Object === Object && self, k = nt || Y || Function("return this")(), U = t && !t.nodeType && t, Fe = U && !0 && e && !e.nodeType && e, ot = Fe && Fe.exports === U;
    function st(r, i) {
      return r.set(i[0], i[1]), r;
    }
    function q(r, i) {
      return r.add(i), r;
    }
    function at(r, i) {
      for (var f = -1, m = r ? r.length : 0; ++f < m && i(r[f], f, r) !== !1; )
        ;
      return r;
    }
    function W(r, i) {
      for (var f = -1, m = i.length, P = r.length; ++f < m; )
        r[P + f] = i[f];
      return r;
    }
    function Be(r, i, f, m) {
      for (var P = -1, L = r ? r.length : 0; ++P < L; )
        f = i(f, r[P], P, r);
      return f;
    }
    function it(r, i) {
      for (var f = -1, m = Array(r); ++f < r; )
        m[f] = i(f);
      return m;
    }
    function ct(r, i) {
      return r == null ? void 0 : r[i];
    }
    function ne(r) {
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
      return r.forEach(function(m, P) {
        f[++i] = [P, m];
      }), f;
    }
    function Te(r, i) {
      return function(f) {
        return r(i(f));
      };
    }
    function oe(r) {
      var i = -1, f = Array(r.size);
      return r.forEach(function(m) {
        f[++i] = m;
      }), f;
    }
    var ut = Array.prototype, pe = Function.prototype, se = Object.prototype, xe = k["__core-js_shared__"], ae = function() {
      var r = /[^.]+$/.exec(xe && xe.keys && xe.keys.IE_PROTO || "");
      return r ? "Symbol(src)_1." + r : "";
    }(), Pe = pe.toString, V = se.hasOwnProperty, _e = se.toString, lt = RegExp(
      "^" + Pe.call(V).replace($, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), ge = ot ? k.Buffer : void 0, Ke = k.Symbol, Re = k.Uint8Array, ft = Te(Object.getPrototypeOf, Object), ye = Object.create, Ue = se.propertyIsEnumerable, me = ut.splice, qe = Object.getOwnPropertySymbols, we = ge ? ge.isBuffer : void 0, c = Te(Object.keys, Object), d = Ze(k, "DataView"), y = Ze(k, "Map"), E = Ze(k, "Promise"), s = Ze(k, "Set"), l = Ze(k, "WeakMap"), g = Ze(Object, "create"), A = je(d), D = je(y), J = je(E), We = je(s), Ne = je(l), ze = Ke ? Ke.prototype : void 0, Le = ze ? ze.valueOf : void 0;
    function Z(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var m = r[i];
        this.set(m[0], m[1]);
      }
    }
    function Jr() {
      this.__data__ = g ? g(null) : {};
    }
    function Zr(r) {
      return this.has(r) && delete this.__data__[r];
    }
    function Xr(r) {
      var i = this.__data__;
      if (g) {
        var f = i[r];
        return f === o ? void 0 : f;
      }
      return V.call(i, r) ? i[r] : void 0;
    }
    function Qr(r) {
      var i = this.__data__;
      return g ? i[r] !== void 0 : V.call(i, r);
    }
    function en(r, i) {
      var f = this.__data__;
      return f[r] = g && i === void 0 ? o : i, this;
    }
    Z.prototype.clear = Jr, Z.prototype.delete = Zr, Z.prototype.get = Xr, Z.prototype.has = Qr, Z.prototype.set = en;
    function ie(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var m = r[i];
        this.set(m[0], m[1]);
      }
    }
    function tn() {
      this.__data__ = [];
    }
    function rn(r) {
      var i = this.__data__, f = ht(i, r);
      if (f < 0)
        return !1;
      var m = i.length - 1;
      return f == m ? i.pop() : me.call(i, f, 1), !0;
    }
    function nn(r) {
      var i = this.__data__, f = ht(i, r);
      return f < 0 ? void 0 : i[f][1];
    }
    function on(r) {
      return ht(this.__data__, r) > -1;
    }
    function sn(r, i) {
      var f = this.__data__, m = ht(f, r);
      return m < 0 ? f.push([r, i]) : f[m][1] = i, this;
    }
    ie.prototype.clear = tn, ie.prototype.delete = rn, ie.prototype.get = nn, ie.prototype.has = on, ie.prototype.set = sn;
    function Ye(r) {
      var i = -1, f = r ? r.length : 0;
      for (this.clear(); ++i < f; ) {
        var m = r[i];
        this.set(m[0], m[1]);
      }
    }
    function an() {
      this.__data__ = {
        hash: new Z(),
        map: new (y || ie)(),
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
      this.__data__ = new ie(r);
    }
    function dn() {
      this.__data__ = new ie();
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
      if (f instanceof ie) {
        var m = f.__data__;
        if (!y || m.length < n - 1)
          return m.push([r, i]), this;
        f = this.__data__ = new Ye(m);
      }
      return f.set(r, i), this;
    }
    Je.prototype.clear = dn, Je.prototype.delete = hn, Je.prototype.get = pn, Je.prototype.has = _n, Je.prototype.set = gn;
    function yn(r, i) {
      var f = xt(r) || Fn(r) ? it(r.length, String) : [], m = f.length, P = !!m;
      for (var L in r)
        V.call(r, L) && !(P && (L == "length" || Vn(L, m))) && f.push(L);
      return f;
    }
    function Jt(r, i, f) {
      var m = r[i];
      (!(V.call(r, i) && er(m, f)) || f === void 0 && !(i in r)) && (r[i] = f);
    }
    function ht(r, i) {
      for (var f = r.length; f--; )
        if (er(r[f][0], i))
          return f;
      return -1;
    }
    function mn(r, i) {
      return r && Zt(i, Pt(i), r);
    }
    function Ot(r, i, f, m, P, L, ce) {
      var I;
      if (m && (I = L ? m(r, P, L, ce) : m(r)), I !== void 0)
        return I;
      if (!_t(r))
        return r;
      var nr = xt(r);
      if (nr) {
        if (I = jn(r), !i)
          return Nn(r, I);
      } else {
        var Xe = Ie(r), or = Xe == _ || Xe == w;
        if (Gn(r))
          return Cn(r, i);
        if (Xe == O || Xe == u || or && !L) {
          if (ne(r))
            return L ? r : {};
          if (I = kn(or ? {} : r), !i)
            return Ln(r, mn(I, r));
        } else {
          if (!C[Xe])
            return L ? r : {};
          I = $n(r, Xe, Ot, i);
        }
      }
      ce || (ce = new Je());
      var sr = ce.get(r);
      if (sr)
        return sr;
      if (ce.set(r, I), !nr)
        var ar = f ? In(r) : Pt(r);
      return at(ar || r, function(Rt, gt) {
        ar && (gt = Rt, Rt = r[gt]), Jt(I, gt, Ot(Rt, i, f, m, gt, r, ce));
      }), I;
    }
    function wn(r) {
      return _t(r) ? ye(r) : {};
    }
    function Sn(r, i, f) {
      var m = i(r);
      return xt(r) ? m : W(m, f(r));
    }
    function bn(r) {
      return _e.call(r);
    }
    function vn(r) {
      if (!_t(r) || Mn(r))
        return !1;
      var i = rr(r) || ne(r) ? lt : K;
      return i.test(je(r));
    }
    function En(r) {
      if (!Qt(r))
        return c(r);
      var i = [];
      for (var f in Object(r))
        V.call(r, f) && f != "constructor" && i.push(f);
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
      var m = i ? f(Ge(r), !0) : Ge(r);
      return Be(m, st, new r.constructor());
    }
    function Tn(r) {
      var i = new r.constructor(r.source, He.exec(r));
      return i.lastIndex = r.lastIndex, i;
    }
    function xn(r, i, f) {
      var m = i ? f(oe(r), !0) : oe(r);
      return Be(m, q, new r.constructor());
    }
    function Pn(r) {
      return Le ? Object(Le.call(r)) : {};
    }
    function Rn(r, i) {
      var f = i ? Tt(r.buffer) : r.buffer;
      return new r.constructor(f, r.byteOffset, r.length);
    }
    function Nn(r, i) {
      var f = -1, m = r.length;
      for (i || (i = Array(m)); ++f < m; )
        i[f] = r[f];
      return i;
    }
    function Zt(r, i, f, m) {
      f || (f = {});
      for (var P = -1, L = i.length; ++P < L; ) {
        var ce = i[P], I = void 0;
        Jt(f, ce, I === void 0 ? r[ce] : I);
      }
      return f;
    }
    function Ln(r, i) {
      return Zt(r, Xt(r), i);
    }
    function In(r) {
      return Sn(r, Pt, Xt);
    }
    function pt(r, i) {
      var f = r.__data__;
      return Dn(i) ? f[typeof i == "string" ? "string" : "hash"] : f.map;
    }
    function Ze(r, i) {
      var f = ct(r, i);
      return vn(f) ? f : void 0;
    }
    var Xt = qe ? Te(qe, Object) : qn, Ie = bn;
    (d && Ie(new d(new ArrayBuffer(1))) != B || y && Ie(new y()) != v || E && Ie(E.resolve()) != F || s && Ie(new s()) != le || l && Ie(new l()) != ee) && (Ie = function(r) {
      var i = _e.call(r), f = i == O ? r.constructor : void 0, m = f ? je(f) : void 0;
      if (m)
        switch (m) {
          case A:
            return B;
          case D:
            return v;
          case J:
            return F;
          case We:
            return le;
          case Ne:
            return ee;
        }
      return i;
    });
    function jn(r) {
      var i = r.length, f = r.constructor(i);
      return i && typeof r[0] == "string" && V.call(r, "index") && (f.index = r.index, f.input = r.input), f;
    }
    function kn(r) {
      return typeof r.constructor == "function" && !Qt(r) ? wn(ft(r)) : {};
    }
    function $n(r, i, f, m) {
      var P = r.constructor;
      switch (i) {
        case fe:
          return Tt(r);
        case h:
        case S:
          return new P(+r);
        case B:
          return An(r, m);
        case te:
        case de:
        case re:
        case he:
        case Me:
        case Ae:
        case z:
        case Oe:
        case G:
          return Rn(r, m);
        case v:
          return On(r, m, f);
        case x:
        case De:
          return new P(r);
        case ue:
          return Tn(r);
        case le:
          return xn(r, m, f);
        case Ce:
          return Pn(r);
      }
    }
    function Vn(r, i) {
      return i = i ?? a, !!i && (typeof r == "number" || rt.test(r)) && r > -1 && r % 1 == 0 && r < i;
    }
    function Dn(r) {
      var i = typeof r;
      return i == "string" || i == "number" || i == "symbol" || i == "boolean" ? r !== "__proto__" : r === null;
    }
    function Mn(r) {
      return !!ae && ae in r;
    }
    function Qt(r) {
      var i = r && r.constructor, f = typeof i == "function" && i.prototype || se;
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
      return Bn(r) && V.call(r, "callee") && (!Ue.call(r, "callee") || _e.call(r) == u);
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
      return i == _ || i == w;
    }
    function Kn(r) {
      return typeof r == "number" && r > -1 && r % 1 == 0 && r <= a;
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
const dr = /* @__PURE__ */ Gt(go), yo = Ve({
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
    const o = R(), a = po(dr(Se(e.data)), Se(e.readonly)), u = Bt(), { data: p, processing: h, readonly: S, errors: b, touched: _ } = a;
    function w() {
      o.value.dispatchEvent(new SubmitEvent("submit"));
    }
    function v() {
      if (e.onSubmit)
        return e.onSubmit(p.value, a);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return u.dispatch(e.method, e.action, { data: p.value });
    }
    function x(O) {
      O.preventDefault(), O.stopPropagation(), h.value = !0, b.value = {}, _.value = {}, be(() => v().catch((F) => {
        F instanceof St && (b.value = F.errors);
      }).finally(() => {
        h.value = !1;
      }));
    }
    return ir(() => e.data, (O) => {
      p.value = dr(Se(O));
    }), ir(() => e.readonly, (O) => {
      S.value = Se(O);
    }), n({
      ctx: a,
      submit: w
    }), N(Kt, a), () => Ee("form", {
      ref: (O) => o.value = O,
      action: e.action,
      method: e.method,
      novalidate: !0,
      onSubmit: x
    }, t.default({
      data: p.value,
      processing: h.value,
      errors: b.value,
      touched: _.value,
      ctx: a,
      submit: w
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
const Pr = Ve({
  inheritAttrs: !1,
  name: "RouterView",
  props: {
    allowLayouts: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  setup(e) {
    const t = wo(), n = bo(), o = So(), a = Q(() => {
      var h;
      return (h = o.value) == null ? void 0 : h.location;
    }), u = Q(() => {
      var h;
      return (h = o.value) == null ? void 0 : h.query;
    }), p = Q(() => {
      if (o.value && o.value.child)
        return { ...o.value.child, parent: o.value };
    });
    return N(Ut, p), N(qt, Q(() => n.value + 1)), N(Or, Q(() => {
      var h;
      return (h = o.value) == null ? void 0 : h.parent;
    })), N(Tr, a), N(xr, u), () => {
      if (o.value && "component" in o.value) {
        let h = t(o.value.component), S = o.value.props;
        h.inheritAttrs = !!h.inheritAttrs;
        let b = Ee(h, S);
        return e.allowLayouts && h.layout && (b = mo(h.layout).concat(b).reverse().reduce((_, w) => (w = typeof w == "string" ? t(w) : w, w.inheritAttrs = !!w.inheritAttrs, Ee(w, S, () => _)))), b;
      }
    };
  }
}), vo = Ve({
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
    const o = oo(), a = Bt(), u = R(!1), p = Q(() => {
      var O;
      let _ = o.value.replace(/\/$/, ""), w = (O = e.href) == null ? void 0 : O.replace(/\/$/, ""), v = _ === w, x = !e.explicit && w && o.value.startsWith(w);
      return v || x;
    }), h = Q(() => e.href ? "a" : "button"), S = Q(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function b(_) {
      if (!e.href || !Eo(_, e.href, e.target) || (_.preventDefault(), e.disabled))
        return;
      let { method: w, href: v, data: x, preserveScroll: O, replace: F } = e;
      u.value = !0, be(() => {
        a.dispatch(w, v, { data: x, preserveScroll: O, replace: F }).then(() => {
          u.value = !1;
        }).catch(() => {
          u.value = !1;
        });
      });
    }
    return () => Ee(
      h.value,
      {
        href: e.href,
        onClick: b,
        ...S.value,
        ...t,
        class: [{ active: p.value, pending: u.value, disabled: e.disabled }]
      },
      // @ts-ignore
      n.default({ active: p, pending: u })
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
const Ao = Ve({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Nr();
    return () => Ee("div", n, t.default({ toasts: o.value }));
  }
}), Oo = Ve({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Nr(), a = R();
    function u() {
      clearTimeout(a.value), o.value = o.value.filter((p) => p.id !== e.toast.id);
    }
    return Mt(() => {
      a.value = setTimeout(() => u(), e.toast.duration * 1e3);
    }), Ht(() => {
      clearTimeout(a.value);
    }), () => Ee("li", n, t.default({ toast: e.toast, close: u }));
  }
}), To = Ve({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: n }) {
    const o = Bt(), a = R(), u = R(!1);
    function p(b) {
      a.value = b, u.value = !0;
    }
    async function h(b) {
      let { method: _, url: w, options: v } = a.value;
      return await o.post(e.action, b).then(async () => await o.dispatch(_, w, v).then(async (x) => (S(), await be(() => x))));
    }
    function S() {
      u.value = !1, a.value = void 0;
    }
    return Mt(() => {
      $t.addEventListener("password.confirm", p);
    }), Ht(() => {
      $t.removeEventListener("password.confirm", p);
    }), () => Ee("div", n, t.default({ open: u.value, submit: h, cancel: S }));
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
  let a = jo(t);
  return n.length === 1 || n[a] == null ? n[0] : n[a];
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
  const a = o[1], u = o[2];
  if (a.includes(",")) {
    const [p, h] = a.split(",", 2);
    if (h === "*" && t >= Number(p))
      return u;
    if (p === "*" && t <= Number(h))
      return u;
    if (t >= Number(p) && t <= Number(h))
      return u;
  }
  return Number(a) == t ? u : null;
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
  const a = new URL(e, o || APP_URL);
  return t && ko(a.searchParams, t), n && (a.hash = n), a.toString();
}
function ko(e, t) {
  Object.keys(t).forEach((n) => {
    Vt(e, n, ke(t[n]));
  });
}
function Vt(e, t, n, o) {
  return o && (t = o + "[" + t + "]"), n == null ? (e.append(t, ""), e) : Array.isArray(n) ? (n.forEach((a, u) => {
    Vt(e, u.toString(), a, t);
  }), e) : typeof n == "object" ? (Object.keys(n).forEach((a) => {
    Vt(e, a, n[a], t);
  }), e) : (typeof n == "boolean" && (n = Number(n)), n == null && (n = ""), e.append(t, n), e);
}
function $o(e, t = {}, n) {
  return Do(Vo(e), t, n);
}
function Vo(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Do(e, t, n) {
  const o = APP_ROUTES[e];
  if (!o)
    throw new Error(`Undefined route: ${e}`);
  const a = Mo(o, t), u = Object.keys(t).reduce((p, h) => (o.params.includes(h) || (p[h] = ke(t[h])), p), {});
  return jr(a, u, n, o.domain);
}
function Mo(e, t) {
  return e.params.reduce((n, o) => {
    let a = e.binding[o] || "id", u = ke(t[o]);
    if (typeof u == "object" && (u = u[a]), !u)
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
      const o = e[n], a = H(o) ? Yo(o) : kr(o);
      if (a)
        for (const u in a)
          t[u] = a[u];
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
      const a = n.startsWith("--") ? n : Ko(n);
      t += `${a}:${o};`;
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
const Zo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Xo = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Qo = /* @__PURE__ */ At(Zo), es = /* @__PURE__ */ At(Xo), ts = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", rs = /* @__PURE__ */ At(
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
  let o = "", a, u, p = 0;
  for (u = n.index; u < t.length; u++) {
    switch (t.charCodeAt(u)) {
      case 34:
        a = "&quot;";
        break;
      case 38:
        a = "&amp;";
        break;
      case 39:
        a = "&#39;";
        break;
      case 60:
        a = "&lt;";
        break;
      case 62:
        a = "&gt;";
        break;
      default:
        continue;
    }
    p !== u && (o += t.slice(p, u)), p = u + 1, o += a;
  }
  return p !== u ? o + t.slice(p, u) : o;
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
    const a = e[o];
    o === "class" ? n += ` class="${ps(a)}"` : o === "style" ? n += ` style="${_s(a)}"` : o === "className" ? n += ` class="${String(a)}"` : n += hs(o, a, t);
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
const { ensureValidVNode: Js } = Ct;
function gs(e, t, n, o, a) {
  e("<!--teleport start-->");
  const u = a.appContext.provides[mr], p = u.__teleportBuffers || (u.__teleportBuffers = {}), h = p[n] || (p[n] = []), S = h.length;
  let b;
  if (o)
    t(e), b = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: _, push: w } = Ur();
    w("<!--teleport start anchor-->"), t(w), w("<!--teleport anchor-->"), b = _();
  }
  h.splice(S, 0, b), e("<!--teleport end-->");
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
function Dt(e) {
  const t = e && e.__v_raw;
  return t ? Dt(t) : e;
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
function Vr(e, ...t) {
  if (jt) return;
  jt = !0;
  const n = $e.length ? $e[$e.length - 1].component : null, o = n && n.appContext.config.warnHandler, a = Ss();
  if (o)
    Hr(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((u) => {
          var p, h;
          return (h = (p = u.toString) == null ? void 0 : p.call(u)) != null ? h : JSON.stringify(u);
        }).join(""),
        n && n.proxy,
        a.map(
          ({ vnode: u }) => `at <${Br(n, u.type)}>`
        ).join(`
`),
        a
      ]
    );
  else {
    const u = [`[Vue warn]: ${e}`, ...t];
    a.length && u.push(`
`, ...bs(a)), console.warn(...u);
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
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, a = ` at <${Br(
    e.component,
    e.type,
    o
  )}`, u = ">" + n;
  return e.props ? [a, ...Es(e.props), u] : [a + u];
}
function Es(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Dr(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Dr(e, t, n) {
  return H(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : ys(t) ? (t = Dr(e, Dt(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : tt(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = Dt(t), n ? t : [`${e}=`, t]);
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
  } catch (a) {
    Cs(a, t, n);
  }
}
function Cs(e, t, n, o = !0) {
  const a = t ? t.vnode : null, { errorHandler: u, throwUnhandledErrorInProduction: p } = t && t.appContext.config || Ho;
  if (t) {
    let h = t.parent;
    const S = t.proxy, b = process.env.NODE_ENV !== "production" ? Mr[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; h; ) {
      const _ = h.ec;
      if (_) {
        for (let w = 0; w < _.length; w++)
          if (_[w](e, S, b) === !1)
            return;
      }
      h = h.parent;
    }
    if (u) {
      Hr(u, null, 10, [
        e,
        S,
        b
      ]);
      return;
    }
  }
  As(e, n, a, o, p);
}
function As(e, t, n, o = !0, a = !1) {
  if (process.env.NODE_ENV !== "production") {
    const u = Mr[t];
    if (n && ms(n), Vr(`Unhandled error${u ? ` during execution of ${u}` : ""}`), n && ws(), o)
      throw e;
    console.error(e);
  } else {
    if (a)
      throw e;
    console.error(e);
  }
}
let Qe, yt = [];
function Fr(e, t) {
  var n, o;
  Qe = e, Qe ? (Qe.enabled = !0, yt.forEach(({ event: a, args: u }) => Qe.emit(a, ...u)), yt = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
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
    let a;
    return (a = e[n]) || (a = e[n] = []), a.push(o), (u) => {
      a.length > 1 ? a.forEach((p) => p(u)) : a[0](u);
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
    const a = t.__file.match(/([^/\\]+)\.\w+$/);
    a && (o = a[1]);
  }
  if (!o && e && e.parent) {
    const a = (u) => {
      for (const p in u)
        if (u[p] === t)
          return p;
    };
    o = a(
      e.components || e.parent.type.components
    ) || a(e.appContext.components);
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
  const a = Ns(
    o,
    !0
    /* isSSR */
  );
  process.env.NODE_ENV !== "production" && Kr();
  const u = vt(a);
  let p = o.sp;
  return u || p ? Promise.resolve(a).then(() => {
    if (u && (p = o.sp), p)
      return Promise.all(
        p.map((S) => S.call(o.proxy))
      );
  }).catch(bt).then(() => gr(o, n)) : gr(o, n);
}
function gr(e, t) {
  process.env.NODE_ENV !== "production" && Gr(e.vnode);
  const n = e.type, { getBuffer: o, push: a } = Ur();
  if (tt(n)) {
    let u = _r(e);
    if (!n.props)
      for (const p in e.attrs)
        p.startsWith("data-v-") && ((u.props || (u.props = {}))[p] = "");
    Et(a, e.subTree = u, e, t);
  } else {
    (!e.render || e.render === bt) && !e.ssrRender && !n.ssrRender && H(n.template) && (n.ssrRender = Ps(n.template));
    const u = e.ssrRender || n.ssrRender;
    if (u) {
      let p = e.inheritAttrs !== !1 ? e.attrs : void 0, h = !1, S = e;
      for (; ; ) {
        const _ = S.vnode.scopeId;
        _ && (h || (p = { ...p }, h = !0), p[_] = "");
        const w = S.parent;
        if (w && w.subTree && w.subTree === S.vnode)
          S = w;
        else
          break;
      }
      if (t) {
        h || (p = { ...p });
        const _ = t.trim().split(" ");
        for (let w = 0; w < _.length; w++)
          p[_[w]] = "";
      }
      const b = pr(e);
      try {
        u(
          e.proxy,
          a,
          e,
          p,
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
        a,
        e.subTree = _r(e),
        e,
        t
      );
    else {
      const p = n.name || n.__file || "<Anonymous>";
      wt(`Component ${p} is missing template or render function.`), a("<!---->");
    }
  }
  return process.env.NODE_ENV !== "production" && Kr(), o();
}
function Et(e, t, n, o) {
  const { type: a, shapeFlag: u, children: p, dirs: h, props: S } = t;
  switch (h && (t.props = js(t, S, h)), a) {
    case ro:
      e(ve(p));
      break;
    case to:
      e(
        p ? `<!--${ls(p)}-->` : "<!---->"
      );
      break;
    case eo:
      e(p);
      break;
    case Qn:
      t.slotScopeIds && (o = (o ? o + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), Yt(
        e,
        p,
        n,
        o
      ), e("<!--]-->");
      break;
    default:
      u & 1 ? Is(e, t, n, o) : u & 6 ? e(qr(t, n, o)) : u & 64 ? ks(e, t, n, o) : u & 128 ? Et(e, t.ssContent, n, o) : wt(
        "[@vue/server-renderer] Invalid VNode type:",
        a,
        `(${typeof a})`
      );
  }
}
function Yt(e, t, n, o) {
  for (let a = 0; a < t.length; a++)
    Et(e, Ls(t[a]), n, o);
}
function Is(e, t, n, o) {
  const a = t.type;
  let { props: u, children: p, shapeFlag: h, scopeId: S } = t, b = `<${a}`;
  u && (b += ds(u, a)), S && (b += ` ${S}`);
  let _ = n, w = t;
  for (; _ && w === _.subTree; )
    w = _.vnode, w.scopeId && (b += ` ${w.scopeId}`), _ = _.parent;
  if (o && (b += ` ${o}`), e(b + ">"), !es(a)) {
    let v = !1;
    u && (u.innerHTML ? (v = !0, e(u.innerHTML)) : u.textContent ? (v = !0, e(ve(u.textContent))) : a === "textarea" && u.value && (v = !0, e(ve(u.value)))), v || (h & 8 ? e(ve(p)) : h & 16 && Yt(
      e,
      p,
      n,
      o
    )), e(`</${a}>`);
  }
}
function js(e, t, n) {
  const o = [];
  for (let a = 0; a < n.length; a++) {
    const u = n[a], {
      dir: { getSSRProps: p }
    } = u;
    if (p) {
      const h = p(u, e);
      h && o.push(h);
    }
  }
  return no(t || {}, ...o);
}
function ks(e, t, n, o) {
  const a = t.props && t.props.to, u = t.props && t.props.disabled;
  if (!a)
    return u || wt("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!H(a))
    return wt(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  gs(
    e,
    (p) => {
      Yt(
        p,
        t.children,
        n,
        o
      );
    },
    a,
    u || u === "",
    n
  );
}
const { isVNode: $s } = Ct;
function mt(e, t, n) {
  if (!e.hasAsync)
    return t + zr(e);
  let o = t;
  for (let a = n; a < e.length; a += 1) {
    const u = e[a];
    if (H(u)) {
      o += u;
      continue;
    }
    if (vt(u))
      return u.then((h) => (e[a] = h, mt(e, o, a)));
    const p = mt(u, o, 0);
    if (vt(p))
      return p.then((h) => (e[a] = h, mt(e, "", a)));
    o = p;
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
    return Yr(Zn({ render: () => e }), t);
  const n = Xn(e._component, e._props);
  n.appContext = e._context, e.provide(mr, t);
  const o = await qr(n), a = await Wr(o);
  if (await Vs(t), t.__watcherHandles)
    for (const u of t.__watcherHandles)
      u();
  return a;
}
async function Vs(e) {
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
const Ds = Ve({
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
    const t = R(e.state.abilities), n = R(e.state.authenticated), o = R(e.state.location), a = R(e.state.stack), u = R(e.state.signature), p = R(e.state.toasts);
    function h() {
      return {
        location: ke(Se(o)),
        signature: ke(Se(u)),
        stack: ke(Se(a))
      };
    }
    async function S(_) {
      return t.value = _.abilities, n.value = _.authenticated, o.value = _.location, u.value = _.signature, _.stack && (a.value = Cr(ke(Se(a.value)), _.stack)), _.toasts && _.toasts.length > 0 && (p.value = [...p.value, ..._.toasts]), await be(() => h());
    }
    N(vr, t), N(br, n), N(wr, o), N(Sr, u), N(Er, S), N(Ar, e.resolver), N(qt, Q(() => 0)), N(Ut, a), N(Rr, p);
    function b(_) {
      _.state ? (o.value = _.state.location, a.value = _.state.stack, u.value = _.state.signature) : (window.history.replaceState(h(), "", o.value), window.scroll(0, 0));
    }
    return Mt(() => {
      window.history.replaceState(h(), "", o.value), window.addEventListener("popstate", b);
    }), Ht(() => {
      window.removeEventListener("popstate", b);
    }), () => Ee(Pr);
  }
});
async function Xs({ initial: e, resolver: t, setup: n }) {
  const o = typeof window > "u", a = e || Ms(), u = n({ router: Ds, props: { resolver: t, state: a } });
  return o ? await Yr(u) : "";
}
function Ms() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
const et = R();
async function yr(e, t) {
  return new Promise((n, o) => {
    function a() {
      et.value.processing = !0, be(() => {
        Promise.resolve(t()).then((p) => {
          et.value = void 0, be(() => n(p));
        }).catch((p) => {
          et.value = void 0, be(() => o(p));
        });
      });
    }
    function u() {
      et.value = void 0, be(() => o());
    }
    et.value = { ...e, processing: !1, confirm: a, cancel: u };
  });
}
async function Hs(e, t) {
  return t !== void 0 ? yr(e, t) : yr({}, e);
}
function Qs() {
  return et;
}
function ea() {
  return Hs;
}
function ta() {
  return j(Kt, null);
}
function ra() {
  let e = j(Kt);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function na() {
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
function oa() {
  const e = Fs();
  return Q(() => {
    if (e && e.value && e.value.location)
      return jr(e.value.location, e.value.query);
  });
}
function sa() {
  const e = j(xr);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function Bs(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function aa(e) {
  return !Bs(e);
}
function ia(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function ca(e) {
  return e.filter((t) => t.parentId === null);
}
function ua(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right && n.parentId === t.id);
}
function la(e, t) {
  return e.filter((n) => n.left < t.left && n.right > t.right);
}
function fa(e, t) {
  return e.filter((n) => n.left > t.left && n.right < t.right);
}
var Gs = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Gs || {});
function da() {
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
  Ds as RouterComponent,
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
  Gs as ToastKind,
  Rr as ToastRegistryInjectionKey,
  Bs as blank,
  po as createFormContext,
  Xs as createFoundationController,
  da as createOtherSoftwareFoundation,
  aa as filled,
  Ys as getModelFromContext,
  ia as hash,
  la as nestedSetAncestors,
  ua as nestedSetChildren,
  fa as nestedSetDescendants,
  ca as nestedSetRoot,
  $o as route,
  zs as setModelWithContext,
  xo as trans,
  Po as transChoice,
  Cr as updateStack,
  jr as url,
  qs as useAbilities,
  Ws as useAuthenticated,
  ea as useConfirmation,
  Qs as useCurrentConfirmation,
  ta as useFormContext,
  Bt as useHttpClient,
  oo as useLocation,
  ra as usePersistentFormContext,
  so as useStackSignature,
  ao as useStateManager,
  Nr as useToasts,
  bo as useViewDepth,
  na as useViewLocation,
  Fs as useViewParent,
  oa as useViewParentLocation,
  sa as useViewQuery,
  wo as useViewResolver,
  So as useViewStack,
  mo as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

var kt = Object.defineProperty;
var Lt = (e, t, r) => t in e ? kt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var h = (e, t, r) => Lt(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as y, ref as S, defineComponent as W, watch as It, provide as _, h as L, nextTick as ce, computed as w, toRaw as C, initDirectivesForSSR as Vt, createApp as Dt, createVNode as Ht, ssrContextKey as je, warn as M, Fragment as jt, Static as Mt, Comment as Ft, Text as Bt, mergeProps as Kt, ssrUtils as Me, onMounted as Ut, onBeforeUnmount as Gt, toValue as D } from "vue";
class se {
  constructor(t) {
    h(this, "xhr");
    h(this, "status");
    h(this, "success");
    h(this, "fail");
    h(this, "partial");
    h(this, "raw");
    h(this, "message");
    h(this, "content");
    if (this.xhr = t, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
  }
}
class F extends se {
  constructor(r) {
    super(r);
    h(this, "location");
    h(this, "signature");
    h(this, "redirect");
    h(this, "stack");
    h(this, "errors");
    let n = JSON.parse(this.xhr.response);
    this.location = n.location, this.signature = n.signature, this.redirect = n.redirect, this.stack = n.stack, this.errors = n.errors;
  }
}
const Fe = Symbol("StateLocation"), Be = Symbol("StateStackSignature"), Ke = Symbol("StateManager");
function qt() {
  let e = y(Fe);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function zt() {
  let e = y(Be);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function Wt() {
  let e = y(Ke);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function Ue(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Ue(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class ue {
  constructor(t, r, n = void 0, o = void 0) {
    h(this, "method");
    h(this, "url");
    h(this, "xhr");
    h(this, "body");
    h(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = r, this.body = n, this.signature = o;
  }
  static send(t, r, n = void 0, o = void 0) {
    return new ue(t, r, n, o).send();
  }
  send() {
    return new Promise((t, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? r(new F(this.xhr)) : r(new se(this.xhr)) : t(new F(this.xhr)));
      }, this.xhr.onerror = () => {
        r(new se(this.xhr));
      }, this.xhr.send(this.transform(this.body));
    });
  }
  transform(t) {
    return t instanceof Blob || t instanceof ArrayBuffer || t instanceof FormData || t instanceof URLSearchParams || typeof t == "string" ? t : t === null ? null : (this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), JSON.stringify(t));
  }
  readCookie(t) {
    const r = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
    return r ? decodeURIComponent(r[3]) : "";
  }
}
const Yt = {
  modal: void 0,
  listener: void 0,
  show(e) {
    typeof e == "object" && (e = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(e)}`);
    const t = document.createElement("html");
    t.innerHTML = e, t.querySelectorAll("a").forEach((n) => n.setAttribute("target", "_top")), this.modal = document.createElement("dialog"), this.modal.style.display = "flex", this.modal.style.width = "100%", this.modal.style.height = "100dvh", this.modal.style.maxWidth = "100%", this.modal.style.maxHeight = "100dvh", this.modal.style.padding = "2rem", this.modal.style.boxSizing = "border-box", this.modal.style.border = "none", this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)", this.modal.style.backdropFilter = "blur(0.125rem)", this.modal.addEventListener("click", () => this.hide());
    const r = document.createElement("iframe");
    if (r.style.backgroundColor = "white", r.style.borderRadius = "0.5rem", r.style.border = "none", r.style.width = "100%", r.style.height = "100%", this.modal.appendChild(r), document.body.prepend(this.modal), document.body.style.overflow = "hidden", !r.contentWindow)
      throw new Error("iframe not yet ready.");
    r.contentWindow.document.open(), r.contentWindow.document.write(t.outerHTML), r.contentWindow.document.close(), this.listener = this.hideOnEscape.bind(this), this.modal.showModal(), document.addEventListener("keydown", this.listener);
  },
  hide() {
    this.modal.outerHTML = "", this.modal = void 0, document.body.style.overflow = "visible", document.removeEventListener("keydown", this.listener);
  },
  hideOnEscape(e) {
    e.key === "Escape" && this.hide();
  }
};
function Ge() {
  const e = Wt(), t = zt();
  async function r(a, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return await ue.send(a, c, l, t.value).then(async (d) => await e.update(d).then((p) => d.redirect ? i(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || s(), f ? o(p) : n(p), Promise.resolve(d)))).catch(async (d) => d instanceof F ? await e.update(d).then(() => Promise.reject(d)) : (console.error(d), APP_DEBUG && d.content && Yt.show(d.content), Promise.reject(d)));
  }
  function n(a) {
    window.history.pushState(a, "", a.location);
  }
  function o(a) {
    window.history.replaceState(a, "", a.location);
  }
  function s() {
    window.scroll(0, 0);
  }
  async function i(a) {
    return a.reload ? await new Promise(() => {
      window.location.href = a.target;
    }) : await r("GET", a.target, {
      preserveScroll: !0,
      replace: !1
    });
  }
  return {
    dispatch: r,
    get: async function(a) {
      return await r("GET", a);
    },
    post: async function(a, c = void 0) {
      return await r("POST", a, { data: c, preserveScroll: !0 });
    },
    patch: async function(a, c = void 0) {
      return await r("PATCH", a, { data: c, preserveScroll: !0 });
    },
    put: async function(a, c = void 0) {
      return await r("PUT", a, { data: c, preserveScroll: !0 });
    },
    delete: async function(a, c = void 0) {
      return await r("DELETE", a, { data: c, preserveScroll: !0 });
    }
  };
}
var E = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qe(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Jt = "Expected a function", ze = "__lodash_hash_undefined__", We = 1 / 0, Zt = 9007199254740991, Xt = "[object Function]", Qt = "[object GeneratorFunction]", er = "[object Symbol]", tr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, rr = /^\w*$/, nr = /^\./, or = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, sr = /[\\^$.*+?()[\]{}|]/g, ar = /\\(\\)?/g, ir = /^\[object .+?Constructor\]$/, cr = /^(?:0|[1-9]\d*)$/, ur = typeof E == "object" && E && E.Object === Object && E, lr = typeof self == "object" && self && self.Object === Object && self, le = ur || lr || Function("return this")();
function fr(e, t) {
  return e == null ? void 0 : e[t];
}
function dr(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var hr = Array.prototype, pr = Function.prototype, Ye = Object.prototype, te = le["__core-js_shared__"], be = function() {
  var e = /[^.]+$/.exec(te && te.keys && te.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), Je = pr.toString, Y = Ye.hasOwnProperty, Ze = Ye.toString, _r = RegExp(
  "^" + Je.call(Y).replace(sr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ce = le.Symbol, gr = hr.splice, yr = Xe(le, "Map"), I = Xe(Object, "create"), $e = Ce ? Ce.prototype : void 0, xe = $e ? $e.toString : void 0;
function x(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function mr() {
  this.__data__ = I ? I(null) : {};
}
function wr(e) {
  return this.has(e) && delete this.__data__[e];
}
function Sr(e) {
  var t = this.__data__;
  if (I) {
    var r = t[e];
    return r === ze ? void 0 : r;
  }
  return Y.call(t, e) ? t[e] : void 0;
}
function Er(e) {
  var t = this.__data__;
  return I ? t[e] !== void 0 : Y.call(t, e);
}
function vr(e, t) {
  var r = this.__data__;
  return r[e] = I && t === void 0 ? ze : t, this;
}
x.prototype.clear = mr;
x.prototype.delete = wr;
x.prototype.get = Sr;
x.prototype.has = Er;
x.prototype.set = vr;
function N(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function br() {
  this.__data__ = [];
}
function Cr(e) {
  var t = this.__data__, r = J(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : gr.call(t, r, 1), !0;
}
function $r(e) {
  var t = this.__data__, r = J(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function xr(e) {
  return J(this.__data__, e) > -1;
}
function Ar(e, t) {
  var r = this.__data__, n = J(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
N.prototype.clear = br;
N.prototype.delete = Cr;
N.prototype.get = $r;
N.prototype.has = xr;
N.prototype.set = Ar;
function O(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Or() {
  this.__data__ = {
    hash: new x(),
    map: new (yr || N)(),
    string: new x()
  };
}
function Tr(e) {
  return Z(this, e).delete(e);
}
function Rr(e) {
  return Z(this, e).get(e);
}
function Pr(e) {
  return Z(this, e).has(e);
}
function Nr(e, t) {
  return Z(this, e).set(e, t), this;
}
O.prototype.clear = Or;
O.prototype.delete = Tr;
O.prototype.get = Rr;
O.prototype.has = Pr;
O.prototype.set = Nr;
function kr(e, t, r) {
  var n = e[t];
  (!(Y.call(e, t) && Qe(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function J(e, t) {
  for (var r = e.length; r--; )
    if (Qe(e[r][0], t))
      return r;
  return -1;
}
function Lr(e) {
  if (!B(e) || Fr(e))
    return !1;
  var t = Gr(e) || dr(e) ? _r : ir;
  return t.test(Ur(e));
}
function Ir(e, t, r, n) {
  if (!B(e))
    return e;
  t = jr(t, e) ? [t] : Dr(t);
  for (var o = -1, s = t.length, i = s - 1, a = e; a != null && ++o < s; ) {
    var c = Kr(t[o]), l = r;
    if (o != i) {
      var u = a[c];
      l = void 0, l === void 0 && (l = B(u) ? u : Hr(t[o + 1]) ? [] : {});
    }
    kr(a, c, l), a = a[c];
  }
  return e;
}
function Vr(e) {
  if (typeof e == "string")
    return e;
  if (de(e))
    return xe ? xe.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -We ? "-0" : t;
}
function Dr(e) {
  return et(e) ? e : Br(e);
}
function Z(e, t) {
  var r = e.__data__;
  return Mr(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function Xe(e, t) {
  var r = fr(e, t);
  return Lr(r) ? r : void 0;
}
function Hr(e, t) {
  return t = t ?? Zt, !!t && (typeof e == "number" || cr.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function jr(e, t) {
  if (et(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || de(e) ? !0 : rr.test(e) || !tr.test(e) || t != null && e in Object(t);
}
function Mr(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Fr(e) {
  return !!be && be in e;
}
var Br = fe(function(e) {
  e = zr(e);
  var t = [];
  return nr.test(e) && t.push(""), e.replace(or, function(r, n, o, s) {
    t.push(o ? s.replace(ar, "$1") : n || r);
  }), t;
});
function Kr(e) {
  if (typeof e == "string" || de(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -We ? "-0" : t;
}
function Ur(e) {
  if (e != null) {
    try {
      return Je.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function fe(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(Jt);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var i = e.apply(this, n);
    return r.cache = s.set(o, i), i;
  };
  return r.cache = new (fe.Cache || O)(), r;
}
fe.Cache = O;
function Qe(e, t) {
  return e === t || e !== e && t !== t;
}
var et = Array.isArray;
function Gr(e) {
  var t = B(e) ? Ze.call(e) : "";
  return t == Xt || t == Qt;
}
function B(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function qr(e) {
  return !!e && typeof e == "object";
}
function de(e) {
  return typeof e == "symbol" || qr(e) && Ze.call(e) == er;
}
function zr(e) {
  return e == null ? "" : Vr(e);
}
function Wr(e, t, r) {
  return e == null ? e : Ir(e, t, r);
}
var Yr = Wr;
const Ae = /* @__PURE__ */ qe(Yr);
var Jr = "Expected a function", tt = "__lodash_hash_undefined__", rt = 1 / 0, Zr = "[object Function]", Xr = "[object GeneratorFunction]", Qr = "[object Symbol]", en = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, tn = /^\w*$/, rn = /^\./, nn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, on = /[\\^$.*+?()[\]{}|]/g, sn = /\\(\\)?/g, an = /^\[object .+?Constructor\]$/, cn = typeof E == "object" && E && E.Object === Object && E, un = typeof self == "object" && self && self.Object === Object && self, he = cn || un || Function("return this")();
function ln(e, t) {
  return e == null ? void 0 : e[t];
}
function fn(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var dn = Array.prototype, hn = Function.prototype, nt = Object.prototype, re = he["__core-js_shared__"], Oe = function() {
  var e = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), ot = hn.toString, pe = nt.hasOwnProperty, st = nt.toString, pn = RegExp(
  "^" + ot.call(pe).replace(on, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Te = he.Symbol, _n = dn.splice, gn = at(he, "Map"), V = at(Object, "create"), Re = Te ? Te.prototype : void 0, Pe = Re ? Re.toString : void 0;
function A(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function yn() {
  this.__data__ = V ? V(null) : {};
}
function mn(e) {
  return this.has(e) && delete this.__data__[e];
}
function wn(e) {
  var t = this.__data__;
  if (V) {
    var r = t[e];
    return r === tt ? void 0 : r;
  }
  return pe.call(t, e) ? t[e] : void 0;
}
function Sn(e) {
  var t = this.__data__;
  return V ? t[e] !== void 0 : pe.call(t, e);
}
function En(e, t) {
  var r = this.__data__;
  return r[e] = V && t === void 0 ? tt : t, this;
}
A.prototype.clear = yn;
A.prototype.delete = mn;
A.prototype.get = wn;
A.prototype.has = Sn;
A.prototype.set = En;
function k(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function vn() {
  this.__data__ = [];
}
function bn(e) {
  var t = this.__data__, r = X(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : _n.call(t, r, 1), !0;
}
function Cn(e) {
  var t = this.__data__, r = X(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function $n(e) {
  return X(this.__data__, e) > -1;
}
function xn(e, t) {
  var r = this.__data__, n = X(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
k.prototype.clear = vn;
k.prototype.delete = bn;
k.prototype.get = Cn;
k.prototype.has = $n;
k.prototype.set = xn;
function T(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function An() {
  this.__data__ = {
    hash: new A(),
    map: new (gn || k)(),
    string: new A()
  };
}
function On(e) {
  return Q(this, e).delete(e);
}
function Tn(e) {
  return Q(this, e).get(e);
}
function Rn(e) {
  return Q(this, e).has(e);
}
function Pn(e, t) {
  return Q(this, e).set(e, t), this;
}
T.prototype.clear = An;
T.prototype.delete = On;
T.prototype.get = Tn;
T.prototype.has = Rn;
T.prototype.set = Pn;
function X(e, t) {
  for (var r = e.length; r--; )
    if (Bn(e[r][0], t))
      return r;
  return -1;
}
function Nn(e, t) {
  t = Vn(t, e) ? [t] : In(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Mn(t[r++])];
  return r && r == n ? e : void 0;
}
function kn(e) {
  if (!ct(e) || Hn(e))
    return !1;
  var t = Kn(e) || fn(e) ? pn : an;
  return t.test(Fn(e));
}
function Ln(e) {
  if (typeof e == "string")
    return e;
  if (ge(e))
    return Pe ? Pe.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -rt ? "-0" : t;
}
function In(e) {
  return it(e) ? e : jn(e);
}
function Q(e, t) {
  var r = e.__data__;
  return Dn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function at(e, t) {
  var r = ln(e, t);
  return kn(r) ? r : void 0;
}
function Vn(e, t) {
  if (it(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ge(e) ? !0 : tn.test(e) || !en.test(e) || t != null && e in Object(t);
}
function Dn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Hn(e) {
  return !!Oe && Oe in e;
}
var jn = _e(function(e) {
  e = Gn(e);
  var t = [];
  return rn.test(e) && t.push(""), e.replace(nn, function(r, n, o, s) {
    t.push(o ? s.replace(sn, "$1") : n || r);
  }), t;
});
function Mn(e) {
  if (typeof e == "string" || ge(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -rt ? "-0" : t;
}
function Fn(e) {
  if (e != null) {
    try {
      return ot.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function _e(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(Jr);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var i = e.apply(this, n);
    return r.cache = s.set(o, i), i;
  };
  return r.cache = new (_e.Cache || T)(), r;
}
_e.Cache = T;
function Bn(e, t) {
  return e === t || e !== e && t !== t;
}
var it = Array.isArray;
function Kn(e) {
  var t = ct(e) ? st.call(e) : "";
  return t == Zr || t == Xr;
}
function ct(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Un(e) {
  return !!e && typeof e == "object";
}
function ge(e) {
  return typeof e == "symbol" || Un(e) && st.call(e) == Qr;
}
function Gn(e) {
  return e == null ? "" : Ln(e);
}
function qn(e, t, r) {
  var n = e == null ? void 0 : Nn(e, t);
  return n === void 0 ? r : n;
}
var zn = qn;
const Wn = /* @__PURE__ */ qe(zn), ye = Symbol("FormContext");
function Yn(e = {}) {
  const t = S(e), r = S({}), n = S({}), o = S(!1);
  function s(c) {
    Ae(n.value, c, !0);
  }
  function i(c, l) {
    return Wn(t.value, c, l);
  }
  function a(c, l) {
    Ae(t.value, c, l);
  }
  return {
    data: t,
    errors: r,
    touched: n,
    processing: o,
    touch: s,
    value: i,
    fill: a
  };
}
function bs(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function Cs(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const Jn = W({
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
    onSubmit: {
      type: Function,
      required: !1
    }
  },
  slots: Object,
  setup(e, { slots: t, expose: r }) {
    const n = S(), o = Yn(e.data), s = Ge(), { data: i, processing: a, errors: c, touched: l } = o;
    function u() {
      n.value.dispatchEvent(new SubmitEvent("submit"));
    }
    function f() {
      if (e.onSubmit)
        return e.onSubmit(i.value, o);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return s.dispatch(e.method, e.action, { data: i.value });
    }
    function d(p) {
      p.preventDefault(), p.stopPropagation(), a.value = !0, c.value = {}, l.value = {}, ce(() => f().catch((b) => {
        b instanceof F && (c.value = b.errors);
      }).finally(() => {
        a.value = !1;
      }));
    }
    return It(() => e.data, (p) => {
      i.value = p;
    }), r({
      ctx: o,
      submit: u
    }), _(ye, o), () => L("form", {
      ref: (p) => n.value = p,
      action: e.action,
      method: e.method,
      onSubmit: d
    }, t.default({
      data: i.value,
      processing: a.value,
      errors: c.value,
      touched: l.value,
      ctx: o,
      submit: u
    }));
  }
}), ut = Symbol("ViewResolver"), me = Symbol("StackedView"), we = Symbol("StackedViewDepth"), lt = Symbol("StackedViewParent"), ft = Symbol("StackedViewLocation"), dt = Symbol("StackedViewQuery");
function Zn(e) {
  return Array.isArray(e) ? e : [e];
}
function Xn() {
  const e = y(ut);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function Qn() {
  const e = y(me);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function eo() {
  const e = y(we);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const ht = W({
  inheritAttrs: !1,
  name: "RouterView",
  props: {
    allowLayouts: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  setup(e) {
    const t = Xn(), r = eo(), n = Qn(), o = w(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.location;
    }), s = w(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.query;
    }), i = w(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return _(me, i), _(we, w(() => r.value + 1)), _(lt, w(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.parent;
    })), _(ft, o), _(dt, s), () => {
      if (n.value && "component" in n.value) {
        let a = t(n.value.component);
        a.inheritAttrs = !!a.inheritAttrs;
        let c = L(a, n.value.props);
        return e.allowLayouts && a.layout && (c = Zn(a.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, L(u, null, () => l)))), c;
      }
    };
  }
}), to = W({
  name: "RouterLink",
  props: {
    method: { type: String, required: !1, default: "GET" },
    href: { type: String, required: !1 },
    data: { type: [], required: !1 },
    preserveScroll: { type: Boolean, required: !1 },
    replace: { type: Boolean, required: !1 },
    target: { type: String, required: !1 },
    disabled: { type: Boolean, required: !1 },
    explicit: { type: Boolean, required: !1 }
  },
  setup(e, { attrs: t, slots: r }) {
    const n = qt(), o = Ge(), s = S(!1), i = w(() => {
      var b;
      let u = n.value.replace(/\/$/, ""), f = (b = e.href) == null ? void 0 : b.replace(/\/$/, ""), d = u === f, p = !e.explicit && f && n.value.startsWith(f);
      return d || p;
    }), a = w(() => e.href ? "a" : "button"), c = w(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !ro(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: f, href: d, data: p, preserveScroll: b, replace: Nt } = e;
      s.value = !0, ce(() => {
        o.dispatch(f, d, { data: p, preserveScroll: b, replace: Nt }).then(() => {
          s.value = !1;
        }).catch(() => {
          s.value = !1;
        });
      });
    }
    return () => L(
      a.value,
      {
        href: e.href,
        onClick: l,
        ...c.value,
        ...t,
        class: [{ active: i.value, pending: s.value, disabled: e.disabled }]
      },
      // @ts-ignore
      r.default({ active: i, pending: s })
    );
  }
});
function ro(e, t, r) {
  return r === "_blank" || no(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function no(e) {
  try {
    let t = window.location.host, r = new URL(e).host;
    return t !== r;
  } catch {
    return !1;
  }
}
function oo(e, t) {
  return _t(pt(e), t);
}
function so(e, t, r) {
  return _t(ao(pt(e), t), r);
}
function pt(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function ao(e, t) {
  let r = e.split("|"), n = io(r, t);
  if (n)
    return n.trim();
  r = uo(r);
  let o = lo(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function io(e, t) {
  for (let r in e) {
    let n = co(r, t);
    if (n)
      return n;
  }
}
function co(e, t) {
  const r = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s, n = e.match(r);
  if (!n || n.length !== 3)
    return null;
  const o = n[1], s = n[2];
  if (o.includes(",")) {
    const [i, a] = o.split(",", 2);
    if (a === "*" && t >= Number(i))
      return s;
    if (i === "*" && t <= Number(a))
      return s;
    if (t >= Number(i) && t <= Number(a))
      return s;
  }
  return Number(o) == t ? s : null;
}
function uo(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function _t(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function lo(e) {
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
function gt(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && fo(o.searchParams, t), r && (o.hash = r), o.toString();
}
function fo(e, t) {
  Object.keys(t).forEach((r) => {
    ae(e, r, C(t[r]));
  });
}
function ae(e, t, r, n) {
  return n && (t = n + "[" + t + "]"), r == null ? (e.append(t, ""), e) : Array.isArray(r) ? (r.forEach((o, s) => {
    ae(e, s.toString(), o, t);
  }), e) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    ae(e, o, r[o], t);
  }), e) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), e.append(t, r), e);
}
function ho(e, t = {}, r) {
  return _o(po(e), t, r);
}
function po(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function _o(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = go(n, t), s = Object.keys(t).reduce((i, a) => (n.params.includes(a) || (i[a] = C(t[a])), i), {});
  return gt(o, s, r, n.domain);
}
function go(e, t) {
  return e.params.reduce((r, n) => {
    let o = e.binding[n] || "id", s = C(t[n]);
    if (typeof s == "object" && (s = s[o]), !s)
      throw new Error(`Parameter ${n} is required for uri ${e.uri}.`);
    return r.replace(new RegExp(`{${n}??}`), s);
  }, e.uri);
}
/**
* @vue/shared v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function ee(e, t) {
  const r = new Set(e.split(","));
  return (n) => r.has(n);
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const K = () => {
}, yo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), mo = Object.assign, Se = Array.isArray, P = (e) => typeof e == "function", g = (e) => typeof e == "string", Ee = (e) => e !== null && typeof e == "object", U = (e) => (Ee(e) || P(e)) && P(e.then) && P(e.catch), wo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, So = /\B([A-Z])/g, Eo = wo(
  (e) => e.replace(So, "-$1").toLowerCase()
);
let Ne;
const vo = () => Ne || (Ne = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function yt(e) {
  if (Se(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = g(n) ? xo(n) : yt(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (g(e) || Ee(e))
    return e;
}
const bo = /;(?![^(]*\))/g, Co = /:([^]+)/, $o = /\/\*[^]*?\*\//g;
function xo(e) {
  const t = {};
  return e.replace($o, "").split(bo).forEach((r) => {
    if (r) {
      const n = r.split(Co);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Ao(e) {
  let t = "";
  if (!e || g(e))
    return t;
  for (const r in e) {
    const n = e[r];
    if (g(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : Eo(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function mt(e) {
  let t = "";
  if (g(e))
    t = e;
  else if (Se(e))
    for (let r = 0; r < e.length; r++) {
      const n = mt(e[r]);
      n && (t += n + " ");
    }
  else if (Ee(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const Oo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", To = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Ro = /* @__PURE__ */ ee(Oo), Po = /* @__PURE__ */ ee(To), No = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ko = /* @__PURE__ */ ee(
  No + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function Lo(e) {
  return !!e || e === "";
}
const Io = /[>/="'\u0009\u000a\u000c\u0020]/, ne = {};
function Vo(e) {
  if (ne.hasOwnProperty(e))
    return ne[e];
  const t = Io.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), ne[e] = !t;
}
const Do = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function Ho(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const jo = /["'&<>]/;
function v(e) {
  const t = "" + e, r = jo.exec(t);
  if (!r)
    return t;
  let n = "", o, s, i = 0;
  for (s = r.index; s < t.length; s++) {
    switch (t.charCodeAt(s)) {
      case 34:
        o = "&quot;";
        break;
      case 38:
        o = "&amp;";
        break;
      case 39:
        o = "&#39;";
        break;
      case 60:
        o = "&lt;";
        break;
      case 62:
        o = "&gt;";
        break;
      default:
        continue;
    }
    i !== s && (n += t.slice(i, s)), i = s + 1, n += o;
  }
  return i !== s ? n + t.slice(i, s) : n;
}
const Mo = /^-?>|<!--|-->|--!>|<!-$/g;
function Fo(e) {
  return e.replace(Mo, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const Bo = /* @__PURE__ */ ee(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function Ko(e, t) {
  let r = "";
  for (const n in e) {
    if (Bo(n) || yo(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${Go(o)}"` : n === "style" ? r += ` style="${qo(o)}"` : r += Uo(n, o, t);
  }
  return r;
}
function Uo(e, t, r) {
  if (!Ho(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || Ro(r)) ? e : Do[e] || e.toLowerCase();
  return ko(n) ? Lo(t) ? ` ${n}` : "" : Vo(n) ? t === "" ? ` ${n}` : ` ${n}="${v(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function Go(e) {
  return v(mt(e));
}
function qo(e) {
  if (!e)
    return "";
  if (g(e))
    return v(e);
  const t = yt(e);
  return v(Ao(t));
}
function zo(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[je], i = s.__teleportBuffers || (s.__teleportBuffers = {}), a = i[r] || (i[r] = []), c = a.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = At();
    f("<!--teleport start anchor-->"), t(f), f("<!--teleport anchor-->"), l = u();
  }
  a.splice(c, 0, l), e("<!--teleport end-->");
}
let ke, G = !0;
const wt = [];
function St() {
  wt.push(G), G = !1;
}
function Et() {
  const e = wt.pop();
  G = e === void 0 ? !0 : e;
}
function Wo(e, t, r) {
  var n;
  t.get(e) !== e._trackId && (t.set(e, e._trackId), e.deps[e._depsLength] !== t ? e.deps[e._depsLength++] = t : e._depsLength++, process.env.NODE_ENV !== "production" && ((n = e.onTrack) == null || n.call(e, mo({ effect: e }, r))));
}
const Yo = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, Le = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function Ie(e, t, r) {
  if (G && ke) {
    let n = Le.get(e);
    n || Le.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = Yo(() => n.delete(r))), Wo(
      ke,
      o,
      process.env.NODE_ENV !== "production" ? {
        target: e,
        type: t,
        key: r
      } : void 0
    );
  }
}
function ie(e) {
  const t = e && e.__v_raw;
  return t ? ie(t) : e;
}
function Jo(e) {
  return !!(e && e.__v_isRef === !0);
}
const $ = [];
function Zo(e) {
  $.push(e);
}
function Xo() {
  $.pop();
}
let oe = !1;
function q(e, ...t) {
  if (oe) return;
  oe = !0, St();
  const r = $.length ? $[$.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = Qo();
  if (n)
    Ct(
      n,
      r,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((s) => {
          var i, a;
          return (a = (i = s.toString) == null ? void 0 : i.call(s)) != null ? a : JSON.stringify(s);
        }).join(""),
        r && r.proxy,
        o.map(
          ({ vnode: s }) => `at <${xt(r, s.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const s = [`[Vue warn]: ${e}`, ...t];
    o.length && s.push(`
`, ...es(o)), console.warn(...s);
  }
  Et(), oe = !1;
}
function Qo() {
  let e = $[$.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const r = t[0];
    r && r.vnode === e ? r.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const n = e.component && e.component.parent;
    e = n && n.vnode;
  }
  return t;
}
function es(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ...ts(r));
  }), t;
}
function ts({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${xt(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...rs(e.props), s] : [o + s];
}
function rs(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...vt(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function vt(e, t, r) {
  return g(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : Jo(t) ? (t = vt(e, ie(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : P(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = ie(t), r ? t : [`${e}=`, t]);
}
const bt = {
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
  15: "component update"
};
function Ct(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    ns(o, t, r);
  }
}
function ns(e, t, r, n = !0) {
  const o = t ? t.vnode : null;
  if (t) {
    let s = t.parent;
    const i = t.proxy, a = process.env.NODE_ENV !== "production" ? bt[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; s; ) {
      const l = s.ec;
      if (l) {
        for (let u = 0; u < l.length; u++)
          if (l[u](e, i, a) === !1)
            return;
      }
      s = s.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      St(), Ct(
        c,
        null,
        10,
        [e, i, a]
      ), Et();
      return;
    }
  }
  os(e, r, o, n);
}
function os(e, t, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = bt[t];
    if (r && Zo(r), q(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && Xo(), n)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let R, H = [];
function $t(e, t) {
  var r, n;
  R = e, R ? (R.enabled = !0, H.forEach(({ event: o, args: s }) => R.emit(o, ...s)), H = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    $t(s, t);
  }), setTimeout(() => {
    R || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, H = []);
  }, 3e3)) : H = [];
}
{
  const e = vo(), t = (r, n) => {
    let o;
    return (o = e[r]) || (o = e[r] = []), o.push(n), (s) => {
      o.length > 1 ? o.forEach((i) => i(s)) : o[0](s);
    };
  };
  t(
    "__VUE_INSTANCE_SETTERS__",
    (r) => r
  ), t(
    "__VUE_SSR_SETTERS__",
    (r) => r
  );
}
process.env.NODE_ENV;
const ss = /(?:^|[-_])(\w)/g, as = (e) => e.replace(ss, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function is(e, t = !0) {
  return P(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function xt(e, t, r = !1) {
  let n = is(t);
  if (!n && t.__file) {
    const o = t.__file.match(/([^/\\]+)\.\w+$/);
    o && (n = o[1]);
  }
  if (!n && e && e.parent) {
    const o = (s) => {
      for (const i in s)
        if (s[i] === t)
          return i;
    };
    n = o(
      e.components || e.parent.type.components
    ) || o(e.appContext.components);
  }
  return n ? as(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function cs(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: us,
  setCurrentRenderingInstance: Ve,
  setupComponent: ls,
  renderComponentRoot: De,
  normalizeVNode: fs
} = Me;
function At() {
  let e = !1;
  const t = [];
  return {
    getBuffer() {
      return t;
    },
    push(r) {
      const n = g(r);
      if (e && n) {
        t[t.length - 1] += r;
        return;
      }
      t.push(r), e = n, (U(r) || Se(r) && r.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function Ot(e, t = null, r) {
  const n = us(e, t, null), o = ls(
    n,
    !0
    /* isSSR */
  ), s = U(o), i = n.sp;
  if (s || i) {
    let a = s ? o : Promise.resolve();
    return i && (a = a.then(
      () => Promise.all(
        i.map((c) => c.call(n.proxy))
      )
    ).catch(K)), a.then(() => He(n, r));
  } else
    return He(n, r);
}
function He(e, t) {
  const r = e.type, { getBuffer: n, push: o } = At();
  if (P(r)) {
    let s = De(e);
    if (!r.props)
      for (const i in e.attrs)
        i.startsWith("data-v-") && ((s.props || (s.props = {}))[i] = "");
    z(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === K) && !e.ssrRender && !r.ssrRender && g(r.template) && (r.ssrRender = cs(r.template));
    for (const i of e.scope.effects)
      i.computed && (i.computed._dirty = !0, i.computed._cacheable = !0);
    const s = e.ssrRender || r.ssrRender;
    if (s) {
      let i = e.inheritAttrs !== !1 ? e.attrs : void 0, a = !1, c = e;
      for (; ; ) {
        const u = c.vnode.scopeId;
        u && (a || (i = { ...i }, a = !0), i[u] = "");
        const f = c.parent;
        if (f && f.subTree && f.subTree === c.vnode)
          c = f;
        else
          break;
      }
      if (t) {
        a || (i = { ...i });
        const u = t.trim().split(" ");
        for (let f = 0; f < u.length; f++)
          i[u[f]] = "";
      }
      const l = Ve(e);
      try {
        s(
          e.proxy,
          o,
          e,
          i,
          // compiler-optimized bindings
          e.props,
          e.setupState,
          e.data,
          e.ctx
        );
      } finally {
        Ve(l);
      }
    } else if (e.render && e.render !== K)
      z(
        o,
        e.subTree = De(e),
        e,
        t
      );
    else {
      const i = r.name || r.__file || "<Anonymous>";
      M(`Component ${i} is missing template or render function.`), o("<!---->");
    }
  }
  return n();
}
function z(e, t, r, n) {
  const { type: o, shapeFlag: s, children: i } = t;
  switch (o) {
    case Bt:
      e(v(i));
      break;
    case Ft:
      e(
        i ? `<!--${Fo(i)}-->` : "<!---->"
      );
      break;
    case Mt:
      e(i);
      break;
    case jt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), ve(
        e,
        i,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? ds(e, t, r, n) : s & 6 ? e(Ot(t, r, n)) : s & 64 ? ps(e, t, r, n) : s & 128 ? z(e, t.ssContent, r, n) : M(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function ve(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    z(e, fs(t[o]), r, n);
}
function ds(e, t, r, n) {
  const o = t.type;
  let { props: s, children: i, shapeFlag: a, scopeId: c, dirs: l } = t, u = `<${o}`;
  l && (s = hs(t, s, l)), s && (u += Ko(s, o)), c && (u += ` ${c}`);
  let f = r, d = t;
  for (; f && d === f.subTree; )
    d = f.vnode, d.scopeId && (u += ` ${d.scopeId}`), f = f.parent;
  if (n && (u += ` ${n}`), e(u + ">"), !Po(o)) {
    let p = !1;
    s && (s.innerHTML ? (p = !0, e(s.innerHTML)) : s.textContent ? (p = !0, e(v(s.textContent))) : o === "textarea" && s.value && (p = !0, e(v(s.value)))), p || (a & 8 ? e(v(i)) : a & 16 && ve(
      e,
      i,
      r,
      n
    )), e(`</${o}>`);
  }
}
function hs(e, t, r) {
  const n = [];
  for (let o = 0; o < r.length; o++) {
    const s = r[o], {
      dir: { getSSRProps: i }
    } = s;
    if (i) {
      const a = i(s, e);
      a && n.push(a);
    }
  }
  return Kt(t || {}, ...n);
}
function ps(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || M("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!g(o))
    return M(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  zo(
    e,
    (i) => {
      ve(
        i,
        t.children,
        r,
        n
      );
    },
    o,
    s || s === "",
    r
  );
}
const { isVNode: _s } = Me;
function j(e, t, r) {
  if (!e.hasAsync)
    return t + Rt(e);
  let n = t;
  for (let o = r; o < e.length; o += 1) {
    const s = e[o];
    if (g(s)) {
      n += s;
      continue;
    }
    if (U(s))
      return s.then((a) => (e[o] = a, j(e, n, o)));
    const i = j(s, n, 0);
    if (U(i))
      return i.then((a) => (e[o] = a, j(e, "", o)));
    n = i;
  }
  return n;
}
function Tt(e) {
  return j(e, "", 0);
}
function Rt(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    g(n) ? t += n : t += Rt(n);
  }
  return t;
}
async function Pt(e, t = {}) {
  if (_s(e))
    return Pt(Dt({ render: () => e }), t);
  const r = Ht(e._component, e._props);
  r.appContext = e._context, e.provide(je, t);
  const n = await Ot(r), o = await Tt(n);
  if (await gs(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function gs(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await Tt(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
Vt();
const ys = W({
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
    const t = S(e.state.location), r = S(e.state.stack), n = S(e.state.signature);
    function o() {
      return {
        location: C(D(t)),
        signature: C(D(n)),
        stack: C(D(r))
      };
    }
    async function s(a) {
      return t.value = a.location, n.value = a.signature, a.stack && (r.value = Ue(C(D(r.value)), a.stack)), await ce(() => o());
    }
    _(Fe, t), _(Be, n), _(Ke, s), _(ut, e.resolver), _(we, w(() => 0)), _(me, r);
    function i(a) {
      a.state ? (t.value = a.state.location, r.value = a.state.stack, n.value = a.state.signature) : (window.history.replaceState(o(), "", t.value), window.scroll(0, 0));
    }
    return Ut(() => {
      window.history.replaceState(o(), "", t.value), window.addEventListener("popstate", i);
    }), Gt(() => {
      window.removeEventListener("popstate", i);
    }), () => L(ht, { allowLayouts: !0 });
  }
});
async function $s({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || ms(), s = r({ router: ys, props: { resolver: t, state: o } });
  return n ? await Pt(s) : "";
}
function ms() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
function xs() {
  return y(ye, null);
}
function As() {
  let e = y(ye);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function Os() {
  const e = y(ft);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function ws() {
  const e = y(lt);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function Ts() {
  const e = ws();
  return w(() => {
    if (e && e.value && e.value.location)
      return gt(e.value.location, e.value.query);
  });
}
function Rs() {
  const e = y(dt);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
const m = {}, Ps = {
  addEventListener(e, t) {
    m[e] ? m[e].push(t) : m[e] = [t];
  },
  remoteEventListener(e, t) {
    m[e] && (m[e] = m[e].filter((r) => r !== t), m[e].length === 0 && delete m[e]);
  },
  dispatch(e, t) {
    return m[e] && m[e].forEach((r) => r(t)), t;
  }
};
function Ss(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function Ns(e) {
  return !Ss(e);
}
function ks(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function Ls() {
  return {
    install(e) {
      e.component("RouterView", ht), e.component("RouterLink", to), e.component("FormController", Jn), e.config.globalProperties.$t = oo, e.config.globalProperties.$tc = so, e.config.globalProperties.$route = ho;
    }
  };
}
export {
  F as CompleteResponse,
  Yt as ErrorModal,
  Ps as EventBus,
  ye as FormContextInjectionKey,
  Jn as FormControllerComponent,
  ue as Request,
  se as Response,
  ys as RouterComponent,
  to as RouterLinkComponent,
  ht as RouterViewComponent,
  we as StackedViewDepthInjectionKey,
  me as StackedViewInjectionKey,
  ft as StackedViewLocationInjectionKey,
  lt as StackedViewParentInjectionKey,
  dt as StackedViewQueryInjectionKey,
  ut as StackedViewResolverInjectionKey,
  Fe as StateLocationInjectionKey,
  Ke as StateManagerInjectionKey,
  Be as StateStackSignatureInjectionKey,
  Ss as blank,
  Yn as createFormContext,
  $s as createFoundationController,
  Ls as createOtherSoftwareFoundation,
  Ns as filled,
  Cs as getModelFromContext,
  ks as hash,
  ho as route,
  bs as setModelWithContext,
  oo as trans,
  so as transChoice,
  Ue as updateStack,
  gt as url,
  xs as useFromContext,
  Ge as useHttpClient,
  qt as useLocation,
  As as usePersistentFormContext,
  zt as useStackSignature,
  Wt as useStateManager,
  eo as useViewDepth,
  Os as useViewLocation,
  ws as useViewParent,
  Ts as useViewParentLocation,
  Rs as useViewQuery,
  Xn as useViewResolver,
  Qn as useViewStack,
  Zn as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

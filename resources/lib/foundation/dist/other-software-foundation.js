var Nt = Object.defineProperty;
var kt = (e, t, r) => t in e ? Nt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var h = (e, t, r) => kt(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as w, ref as S, defineComponent as z, watch as Lt, provide as _, h as k, nextTick as ae, computed as m, toRaw as b, initDirectivesForSSR as It, createApp as Vt, createVNode as Dt, ssrContextKey as De, warn as M, Fragment as jt, Static as Ht, Comment as Mt, Text as Ft, mergeProps as Bt, ssrUtils as je, onMounted as Kt, onBeforeUnmount as Ut, toValue as D } from "vue";
const He = Symbol("StateLocation"), Me = Symbol("StateStackSignature"), Fe = Symbol("StateManager");
function Gt() {
  let e = w(He);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function qt() {
  let e = w(Me);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function zt() {
  let e = w(Fe);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function Be(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Be(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class Se {
  constructor(t) {
    h(this, "xhr");
    h(this, "status");
    h(this, "success");
    h(this, "fail");
    h(this, "partial");
    h(this, "raw");
    h(this, "message");
    h(this, "content");
    h(this, "location");
    h(this, "signature");
    h(this, "redirect");
    h(this, "stack");
    h(this, "errors");
    if (this.xhr = t, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
    let r = JSON.parse(this.xhr.response);
    this.location = r.location, this.signature = r.signature, this.redirect = r.redirect, this.stack = r.stack, this.errors = r.errors;
  }
}
class ie {
  constructor(t, r, n = void 0, o = void 0) {
    h(this, "method");
    h(this, "url");
    h(this, "xhr");
    h(this, "body");
    h(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = r, this.body = n, this.signature = o;
  }
  static send(t, r, n = void 0, o = void 0) {
    return new ie(t, r, n, o).send();
  }
  send() {
    return new Promise((t, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        if (this.xhr.readyState !== XMLHttpRequest.DONE || !this.xhr.status)
          return;
        const n = new Se(this.xhr);
        n.fail && r(n), t(n);
      }, this.xhr.onerror = () => {
        r(new Se(this.xhr));
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
const Wt = {
  modal: void 0,
  listener: void 0,
  show(e) {
    typeof e == "object" && (e = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(e)}`);
    const t = document.createElement("html");
    t.innerHTML = e, t.querySelectorAll("a").forEach((n) => n.setAttribute("target", "_top")), this.modal = document.createElement("div"), this.modal.style.position = "fixed", this.modal.style.inset = "0", this.modal.style.width = "100vw", this.modal.style.height = "100vh", this.modal.style.padding = "2rem", this.modal.style.boxSizing = "border-box", this.modal.style.backgroundColor = "rgba(0, 0, 0, .6)", this.modal.style.backdropFilter = "blur(0.125rem)", this.modal.style.zIndex = "200000", this.modal.addEventListener("click", () => this.hide());
    const r = document.createElement("iframe");
    if (r.style.backgroundColor = "white", r.style.borderRadius = "0.25rem", r.style.border = "none", r.style.width = "100%", r.style.height = "100%", this.modal.appendChild(r), document.body.prepend(this.modal), document.body.style.overflow = "hidden", !r.contentWindow)
      throw new Error("iframe not yet ready.");
    r.contentWindow.document.open(), r.contentWindow.document.write(t.outerHTML), r.contentWindow.document.close(), this.listener = this.hideOnEscape.bind(this), document.addEventListener("keydown", this.listener);
  },
  hide() {
    this.modal.outerHTML = "", this.modal = void 0, document.body.style.overflow = "visible", document.removeEventListener("keydown", this.listener);
  },
  hideOnEscape(e) {
    e.key === "Escape" && this.hide();
  }
};
function Ke() {
  const e = zt(), t = qt();
  async function r(a, c, { data: l = void 0, preserveScroll: u = !1, replace: d = !1 } = {}) {
    return await ie.send(a, c, l, t.value).then(async (f) => await e.update(f).then((p) => f.redirect ? i(f.redirect) : f.raw ? Promise.resolve(f.raw) : (u || s(), d ? o(p) : n(p), Promise.resolve(f)))).catch(async (f) => f.status === 422 ? await e.update(f).then(() => Promise.reject(f)) : (console.error(f), APP_DEBUG && f.content && Wt.show(f.content), Promise.reject(f)));
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
function Ue(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Yt = "Expected a function", Ge = "__lodash_hash_undefined__", qe = 1 / 0, Jt = 9007199254740991, Zt = "[object Function]", Xt = "[object GeneratorFunction]", Qt = "[object Symbol]", er = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, tr = /^\w*$/, rr = /^\./, nr = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, or = /[\\^$.*+?()[\]{}|]/g, sr = /\\(\\)?/g, ar = /^\[object .+?Constructor\]$/, ir = /^(?:0|[1-9]\d*)$/, cr = typeof E == "object" && E && E.Object === Object && E, ur = typeof self == "object" && self && self.Object === Object && self, ce = cr || ur || Function("return this")();
function lr(e, t) {
  return e == null ? void 0 : e[t];
}
function fr(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var dr = Array.prototype, hr = Function.prototype, ze = Object.prototype, ee = ce["__core-js_shared__"], Ee = function() {
  var e = /[^.]+$/.exec(ee && ee.keys && ee.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), We = hr.toString, W = ze.hasOwnProperty, Ye = ze.toString, pr = RegExp(
  "^" + We.call(W).replace(or, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), ve = ce.Symbol, _r = dr.splice, gr = Je(ce, "Map"), L = Je(Object, "create"), be = ve ? ve.prototype : void 0, $e = be ? be.toString : void 0;
function C(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function yr() {
  this.__data__ = L ? L(null) : {};
}
function mr(e) {
  return this.has(e) && delete this.__data__[e];
}
function wr(e) {
  var t = this.__data__;
  if (L) {
    var r = t[e];
    return r === Ge ? void 0 : r;
  }
  return W.call(t, e) ? t[e] : void 0;
}
function Sr(e) {
  var t = this.__data__;
  return L ? t[e] !== void 0 : W.call(t, e);
}
function Er(e, t) {
  var r = this.__data__;
  return r[e] = L && t === void 0 ? Ge : t, this;
}
C.prototype.clear = yr;
C.prototype.delete = mr;
C.prototype.get = wr;
C.prototype.has = Sr;
C.prototype.set = Er;
function P(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function vr() {
  this.__data__ = [];
}
function br(e) {
  var t = this.__data__, r = Y(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : _r.call(t, r, 1), !0;
}
function $r(e) {
  var t = this.__data__, r = Y(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Cr(e) {
  return Y(this.__data__, e) > -1;
}
function Ar(e, t) {
  var r = this.__data__, n = Y(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
P.prototype.clear = vr;
P.prototype.delete = br;
P.prototype.get = $r;
P.prototype.has = Cr;
P.prototype.set = Ar;
function O(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Or() {
  this.__data__ = {
    hash: new C(),
    map: new (gr || P)(),
    string: new C()
  };
}
function Tr(e) {
  return J(this, e).delete(e);
}
function Rr(e) {
  return J(this, e).get(e);
}
function xr(e) {
  return J(this, e).has(e);
}
function Pr(e, t) {
  return J(this, e).set(e, t), this;
}
O.prototype.clear = Or;
O.prototype.delete = Tr;
O.prototype.get = Rr;
O.prototype.has = xr;
O.prototype.set = Pr;
function Nr(e, t, r) {
  var n = e[t];
  (!(W.call(e, t) && Ze(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function Y(e, t) {
  for (var r = e.length; r--; )
    if (Ze(e[r][0], t))
      return r;
  return -1;
}
function kr(e) {
  if (!F(e) || Mr(e))
    return !1;
  var t = Ur(e) || fr(e) ? pr : ar;
  return t.test(Kr(e));
}
function Lr(e, t, r, n) {
  if (!F(e))
    return e;
  t = jr(t, e) ? [t] : Vr(t);
  for (var o = -1, s = t.length, i = s - 1, a = e; a != null && ++o < s; ) {
    var c = Br(t[o]), l = r;
    if (o != i) {
      var u = a[c];
      l = void 0, l === void 0 && (l = F(u) ? u : Dr(t[o + 1]) ? [] : {});
    }
    Nr(a, c, l), a = a[c];
  }
  return e;
}
function Ir(e) {
  if (typeof e == "string")
    return e;
  if (le(e))
    return $e ? $e.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -qe ? "-0" : t;
}
function Vr(e) {
  return Xe(e) ? e : Fr(e);
}
function J(e, t) {
  var r = e.__data__;
  return Hr(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function Je(e, t) {
  var r = lr(e, t);
  return kr(r) ? r : void 0;
}
function Dr(e, t) {
  return t = t ?? Jt, !!t && (typeof e == "number" || ir.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function jr(e, t) {
  if (Xe(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || le(e) ? !0 : tr.test(e) || !er.test(e) || t != null && e in Object(t);
}
function Hr(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Mr(e) {
  return !!Ee && Ee in e;
}
var Fr = ue(function(e) {
  e = qr(e);
  var t = [];
  return rr.test(e) && t.push(""), e.replace(nr, function(r, n, o, s) {
    t.push(o ? s.replace(sr, "$1") : n || r);
  }), t;
});
function Br(e) {
  if (typeof e == "string" || le(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -qe ? "-0" : t;
}
function Kr(e) {
  if (e != null) {
    try {
      return We.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function ue(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(Yt);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var i = e.apply(this, n);
    return r.cache = s.set(o, i), i;
  };
  return r.cache = new (ue.Cache || O)(), r;
}
ue.Cache = O;
function Ze(e, t) {
  return e === t || e !== e && t !== t;
}
var Xe = Array.isArray;
function Ur(e) {
  var t = F(e) ? Ye.call(e) : "";
  return t == Zt || t == Xt;
}
function F(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Gr(e) {
  return !!e && typeof e == "object";
}
function le(e) {
  return typeof e == "symbol" || Gr(e) && Ye.call(e) == Qt;
}
function qr(e) {
  return e == null ? "" : Ir(e);
}
function zr(e, t, r) {
  return e == null ? e : Lr(e, t, r);
}
var Wr = zr;
const Ce = /* @__PURE__ */ Ue(Wr);
var Yr = "Expected a function", Qe = "__lodash_hash_undefined__", et = 1 / 0, Jr = "[object Function]", Zr = "[object GeneratorFunction]", Xr = "[object Symbol]", Qr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, en = /^\w*$/, tn = /^\./, rn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, nn = /[\\^$.*+?()[\]{}|]/g, on = /\\(\\)?/g, sn = /^\[object .+?Constructor\]$/, an = typeof E == "object" && E && E.Object === Object && E, cn = typeof self == "object" && self && self.Object === Object && self, fe = an || cn || Function("return this")();
function un(e, t) {
  return e == null ? void 0 : e[t];
}
function ln(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var fn = Array.prototype, dn = Function.prototype, tt = Object.prototype, te = fe["__core-js_shared__"], Ae = function() {
  var e = /[^.]+$/.exec(te && te.keys && te.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), rt = dn.toString, de = tt.hasOwnProperty, nt = tt.toString, hn = RegExp(
  "^" + rt.call(de).replace(nn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Oe = fe.Symbol, pn = fn.splice, _n = ot(fe, "Map"), I = ot(Object, "create"), Te = Oe ? Oe.prototype : void 0, Re = Te ? Te.toString : void 0;
function A(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function gn() {
  this.__data__ = I ? I(null) : {};
}
function yn(e) {
  return this.has(e) && delete this.__data__[e];
}
function mn(e) {
  var t = this.__data__;
  if (I) {
    var r = t[e];
    return r === Qe ? void 0 : r;
  }
  return de.call(t, e) ? t[e] : void 0;
}
function wn(e) {
  var t = this.__data__;
  return I ? t[e] !== void 0 : de.call(t, e);
}
function Sn(e, t) {
  var r = this.__data__;
  return r[e] = I && t === void 0 ? Qe : t, this;
}
A.prototype.clear = gn;
A.prototype.delete = yn;
A.prototype.get = mn;
A.prototype.has = wn;
A.prototype.set = Sn;
function N(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function En() {
  this.__data__ = [];
}
function vn(e) {
  var t = this.__data__, r = Z(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : pn.call(t, r, 1), !0;
}
function bn(e) {
  var t = this.__data__, r = Z(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function $n(e) {
  return Z(this.__data__, e) > -1;
}
function Cn(e, t) {
  var r = this.__data__, n = Z(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
N.prototype.clear = En;
N.prototype.delete = vn;
N.prototype.get = bn;
N.prototype.has = $n;
N.prototype.set = Cn;
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
    map: new (_n || N)(),
    string: new A()
  };
}
function On(e) {
  return X(this, e).delete(e);
}
function Tn(e) {
  return X(this, e).get(e);
}
function Rn(e) {
  return X(this, e).has(e);
}
function xn(e, t) {
  return X(this, e).set(e, t), this;
}
T.prototype.clear = An;
T.prototype.delete = On;
T.prototype.get = Tn;
T.prototype.has = Rn;
T.prototype.set = xn;
function Z(e, t) {
  for (var r = e.length; r--; )
    if (Fn(e[r][0], t))
      return r;
  return -1;
}
function Pn(e, t) {
  t = In(t, e) ? [t] : Ln(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Hn(t[r++])];
  return r && r == n ? e : void 0;
}
function Nn(e) {
  if (!at(e) || Dn(e))
    return !1;
  var t = Bn(e) || ln(e) ? hn : sn;
  return t.test(Mn(e));
}
function kn(e) {
  if (typeof e == "string")
    return e;
  if (pe(e))
    return Re ? Re.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -et ? "-0" : t;
}
function Ln(e) {
  return st(e) ? e : jn(e);
}
function X(e, t) {
  var r = e.__data__;
  return Vn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function ot(e, t) {
  var r = un(e, t);
  return Nn(r) ? r : void 0;
}
function In(e, t) {
  if (st(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || pe(e) ? !0 : en.test(e) || !Qr.test(e) || t != null && e in Object(t);
}
function Vn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Dn(e) {
  return !!Ae && Ae in e;
}
var jn = he(function(e) {
  e = Un(e);
  var t = [];
  return tn.test(e) && t.push(""), e.replace(rn, function(r, n, o, s) {
    t.push(o ? s.replace(on, "$1") : n || r);
  }), t;
});
function Hn(e) {
  if (typeof e == "string" || pe(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -et ? "-0" : t;
}
function Mn(e) {
  if (e != null) {
    try {
      return rt.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function he(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(Yr);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var i = e.apply(this, n);
    return r.cache = s.set(o, i), i;
  };
  return r.cache = new (he.Cache || T)(), r;
}
he.Cache = T;
function Fn(e, t) {
  return e === t || e !== e && t !== t;
}
var st = Array.isArray;
function Bn(e) {
  var t = at(e) ? nt.call(e) : "";
  return t == Jr || t == Zr;
}
function at(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Kn(e) {
  return !!e && typeof e == "object";
}
function pe(e) {
  return typeof e == "symbol" || Kn(e) && nt.call(e) == Xr;
}
function Un(e) {
  return e == null ? "" : kn(e);
}
function Gn(e, t, r) {
  var n = e == null ? void 0 : Pn(e, t);
  return n === void 0 ? r : n;
}
var qn = Gn;
const zn = /* @__PURE__ */ Ue(qn), it = Symbol("FormContext");
function Wn(e = {}) {
  const t = S(e), r = S({}), n = S({}), o = S(!1);
  function s(c) {
    Ce(n.value, c, !0);
  }
  function i(c, l) {
    return zn(t.value, c, l);
  }
  function a(c, l) {
    Ce(t.value, c, l);
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
function Es(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function vs(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const Yn = z({
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
    const n = S(), o = Wn(e.data), s = Ke(), { data: i, processing: a, errors: c, touched: l } = o;
    function u() {
      if (e.onSubmit)
        return e.onSubmit(i.value, o);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return s.dispatch(e.method, e.action, { data: i.value });
    }
    function d(f) {
      f.preventDefault(), f.stopPropagation(), a.value = !0, c.value = {}, l.value = {}, ae(() => u().catch((p) => {
        p.status && p.status === 422 && p.errors && (c.value = p.errors);
      }).finally(() => {
        a.value = !1;
      }));
    }
    return Lt(() => e.data, (f) => {
      i.value = f;
    }), r({
      ctx: o,
      submit() {
        n.value.dispatchEvent(new SubmitEvent("submit"));
      }
    }), _(it, o), () => k("form", {
      ref: (f) => n.value = f,
      action: e.action,
      method: e.method,
      onSubmit: d
    }, t.default({
      data: i.value,
      processing: a.value,
      errors: c.value,
      touched: l.value,
      ctx: o
    }));
  }
}), ct = Symbol("ViewResolver"), _e = Symbol("StackedView"), ge = Symbol("StackedViewDepth"), ut = Symbol("StackedViewParent"), lt = Symbol("StackedViewLocation"), ft = Symbol("StackedViewQuery");
function Jn(e) {
  return Array.isArray(e) ? e : [e];
}
function Zn() {
  const e = w(ct);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function Xn() {
  const e = w(_e);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function Qn() {
  const e = w(ge);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const dt = z({
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
    const t = Zn(), r = Qn(), n = Xn(), o = m(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.location;
    }), s = m(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.query;
    }), i = m(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return _(_e, i), _(ge, m(() => r.value + 1)), _(ut, m(() => {
      var a;
      return (a = n.value) == null ? void 0 : a.parent;
    })), _(lt, o), _(ft, s), () => {
      if (n.value && "component" in n.value) {
        let a = t(n.value.component);
        a.inheritAttrs = !!a.inheritAttrs;
        let c = k(a, n.value.props);
        return e.allowLayouts && a.layout && (c = Jn(a.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, k(u, null, () => l)))), c;
      }
    };
  }
}), eo = z({
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
    const n = Gt(), o = Ke(), s = S(!1), i = m(() => {
      var V;
      let u = n.value.replace(/\/$/, ""), d = (V = e.href) == null ? void 0 : V.replace(/\/$/, ""), f = u === d, p = !e.explicit && d && n.value.startsWith(d);
      return f || p;
    }), a = m(() => e.href ? "a" : "button"), c = m(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !to(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: d, href: f, data: p, preserveScroll: V, replace: Pt } = e;
      s.value = !0, ae(() => {
        o.dispatch(d, f, { data: p, preserveScroll: V, replace: Pt }).then(() => {
          s.value = !1;
        }).catch(() => {
          s.value = !1;
        });
      });
    }
    return () => k(
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
function to(e, t, r) {
  return r === "_blank" || ro(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function ro(e) {
  try {
    let t = window.location.host, r = new URL(e).host;
    return t !== r;
  } catch {
    return !1;
  }
}
function no(e, t) {
  return pt(ht(e), t);
}
function oo(e, t, r) {
  return pt(so(ht(e), t), r);
}
function ht(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function so(e, t) {
  let r = e.split("|"), n = ao(r, t);
  if (n)
    return n.trim();
  r = co(r);
  let o = uo(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function ao(e, t) {
  for (let r in e) {
    let n = io(r, t);
    if (n)
      return n;
  }
}
function io(e, t) {
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
function co(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function pt(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function uo(e) {
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
function _t(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && lo(o.searchParams, t), r && (o.hash = r), o.toString();
}
function lo(e, t) {
  Object.keys(t).forEach((r) => {
    oe(e, r, b(t[r]));
  });
}
function oe(e, t, r, n) {
  return n && (t = n + "[" + t + "]"), r == null ? (e.append(t, ""), e) : Array.isArray(r) ? (r.forEach((o, s) => {
    oe(e, s.toString(), o, t);
  }), e) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    oe(e, o, r[o], t);
  }), e) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), e.append(t, r), e);
}
function fo(e, t = {}, r) {
  return po(ho(e), t, r);
}
function ho(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function po(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = _o(n, t), s = Object.keys(t).reduce((i, a) => (n.params.includes(a) || (i[a] = b(t[a])), i), {});
  return _t(o, s, r, n.domain);
}
function _o(e, t) {
  return e.params.reduce((r, n) => {
    let o = e.binding[n] || "id", s = b(t[n]);
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
function Q(e, t) {
  const r = new Set(e.split(","));
  return (n) => r.has(n);
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const B = () => {
}, go = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), yo = Object.assign, ye = Array.isArray, x = (e) => typeof e == "function", g = (e) => typeof e == "string", me = (e) => e !== null && typeof e == "object", K = (e) => (me(e) || x(e)) && x(e.then) && x(e.catch), mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, wo = /\B([A-Z])/g, So = mo(
  (e) => e.replace(wo, "-$1").toLowerCase()
);
let xe;
const Eo = () => xe || (xe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function gt(e) {
  if (ye(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = g(n) ? Co(n) : gt(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (g(e) || me(e))
    return e;
}
const vo = /;(?![^(]*\))/g, bo = /:([^]+)/, $o = /\/\*[^]*?\*\//g;
function Co(e) {
  const t = {};
  return e.replace($o, "").split(vo).forEach((r) => {
    if (r) {
      const n = r.split(bo);
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
      const o = r.startsWith("--") ? r : So(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function yt(e) {
  let t = "";
  if (g(e))
    t = e;
  else if (ye(e))
    for (let r = 0; r < e.length; r++) {
      const n = yt(e[r]);
      n && (t += n + " ");
    }
  else if (me(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const Oo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", To = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Ro = /* @__PURE__ */ Q(Oo), xo = /* @__PURE__ */ Q(To), Po = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", No = /* @__PURE__ */ Q(
  Po + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function ko(e) {
  return !!e || e === "";
}
const Lo = /[>/="'\u0009\u000a\u000c\u0020]/, re = {};
function Io(e) {
  if (re.hasOwnProperty(e))
    return re[e];
  const t = Lo.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), re[e] = !t;
}
const Vo = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function Do(e) {
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
const Ho = /^-?>|<!--|-->|--!>|<!-$/g;
function Mo(e) {
  return e.replace(Ho, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const Fo = /* @__PURE__ */ Q(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function Bo(e, t) {
  let r = "";
  for (const n in e) {
    if (Fo(n) || go(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${Uo(o)}"` : n === "style" ? r += ` style="${Go(o)}"` : r += Ko(n, o, t);
  }
  return r;
}
function Ko(e, t, r) {
  if (!Do(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || Ro(r)) ? e : Vo[e] || e.toLowerCase();
  return No(n) ? ko(t) ? ` ${n}` : "" : Io(n) ? t === "" ? ` ${n}` : ` ${n}="${v(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function Uo(e) {
  return v(yt(e));
}
function Go(e) {
  if (!e)
    return "";
  if (g(e))
    return v(e);
  const t = gt(e);
  return v(Ao(t));
}
function qo(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[De], i = s.__teleportBuffers || (s.__teleportBuffers = {}), a = i[r] || (i[r] = []), c = a.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: d } = At();
    d("<!--teleport start anchor-->"), t(d), d("<!--teleport anchor-->"), l = u();
  }
  a.splice(c, 0, l), e("<!--teleport end-->");
}
let Pe, U = !0;
const mt = [];
function wt() {
  mt.push(U), U = !1;
}
function St() {
  const e = mt.pop();
  U = e === void 0 ? !0 : e;
}
function zo(e, t, r) {
  var n;
  t.get(e) !== e._trackId && (t.set(e, e._trackId), e.deps[e._depsLength] !== t ? e.deps[e._depsLength++] = t : e._depsLength++, process.env.NODE_ENV !== "production" && ((n = e.onTrack) == null || n.call(e, yo({ effect: e }, r))));
}
const Wo = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, Ne = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function ke(e, t, r) {
  if (U && Pe) {
    let n = Ne.get(e);
    n || Ne.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = Wo(() => n.delete(r))), zo(
      Pe,
      o,
      process.env.NODE_ENV !== "production" ? {
        target: e,
        type: t,
        key: r
      } : void 0
    );
  }
}
function se(e) {
  const t = e && e.__v_raw;
  return t ? se(t) : e;
}
function Yo(e) {
  return !!(e && e.__v_isRef === !0);
}
const $ = [];
function Jo(e) {
  $.push(e);
}
function Zo() {
  $.pop();
}
let ne = !1;
function G(e, ...t) {
  if (ne) return;
  ne = !0, wt();
  const r = $.length ? $[$.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = Xo();
  if (n)
    bt(
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
          ({ vnode: s }) => `at <${Ct(r, s.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const s = [`[Vue warn]: ${e}`, ...t];
    o.length && s.push(`
`, ...Qo(o)), console.warn(...s);
  }
  St(), ne = !1;
}
function Xo() {
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
function Qo(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ...es(r));
  }), t;
}
function es({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${Ct(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...ts(e.props), s] : [o + s];
}
function ts(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...Et(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function Et(e, t, r) {
  return g(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : Yo(t) ? (t = Et(e, se(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : x(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = se(t), r ? t : [`${e}=`, t]);
}
const vt = {
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
function bt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    rs(o, t, r);
  }
}
function rs(e, t, r, n = !0) {
  const o = t ? t.vnode : null;
  if (t) {
    let s = t.parent;
    const i = t.proxy, a = process.env.NODE_ENV !== "production" ? vt[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
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
      wt(), bt(
        c,
        null,
        10,
        [e, i, a]
      ), St();
      return;
    }
  }
  ns(e, r, o, n);
}
function ns(e, t, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = vt[t];
    if (r && Jo(r), G(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && Zo(), n)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let R, j = [];
function $t(e, t) {
  var r, n;
  R = e, R ? (R.enabled = !0, j.forEach(({ event: o, args: s }) => R.emit(o, ...s)), j = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    $t(s, t);
  }), setTimeout(() => {
    R || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, j = []);
  }, 3e3)) : j = [];
}
{
  const e = Eo(), t = (r, n) => {
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
const os = /(?:^|[-_])(\w)/g, ss = (e) => e.replace(os, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function as(e, t = !0) {
  return x(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ct(e, t, r = !1) {
  let n = as(t);
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
  return n ? ss(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function is(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: cs,
  setCurrentRenderingInstance: Le,
  setupComponent: us,
  renderComponentRoot: Ie,
  normalizeVNode: ls
} = je;
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
      t.push(r), e = n, (K(r) || ye(r) && r.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function Ot(e, t = null, r) {
  const n = cs(e, t, null), o = us(
    n,
    !0
    /* isSSR */
  ), s = K(o), i = n.sp;
  if (s || i) {
    let a = s ? o : Promise.resolve();
    return i && (a = a.then(
      () => Promise.all(
        i.map((c) => c.call(n.proxy))
      )
    ).catch(B)), a.then(() => Ve(n, r));
  } else
    return Ve(n, r);
}
function Ve(e, t) {
  const r = e.type, { getBuffer: n, push: o } = At();
  if (x(r)) {
    let s = Ie(e);
    if (!r.props)
      for (const i in e.attrs)
        i.startsWith("data-v-") && ((s.props || (s.props = {}))[i] = "");
    q(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === B) && !e.ssrRender && !r.ssrRender && g(r.template) && (r.ssrRender = is(r.template));
    for (const i of e.scope.effects)
      i.computed && (i.computed._dirty = !0, i.computed._cacheable = !0);
    const s = e.ssrRender || r.ssrRender;
    if (s) {
      let i = e.inheritAttrs !== !1 ? e.attrs : void 0, a = !1, c = e;
      for (; ; ) {
        const u = c.vnode.scopeId;
        u && (a || (i = { ...i }, a = !0), i[u] = "");
        const d = c.parent;
        if (d && d.subTree && d.subTree === c.vnode)
          c = d;
        else
          break;
      }
      if (t) {
        a || (i = { ...i });
        const u = t.trim().split(" ");
        for (let d = 0; d < u.length; d++)
          i[u[d]] = "";
      }
      const l = Le(e);
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
        Le(l);
      }
    } else if (e.render && e.render !== B)
      q(
        o,
        e.subTree = Ie(e),
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
function q(e, t, r, n) {
  const { type: o, shapeFlag: s, children: i } = t;
  switch (o) {
    case Ft:
      e(v(i));
      break;
    case Mt:
      e(
        i ? `<!--${Mo(i)}-->` : "<!---->"
      );
      break;
    case Ht:
      e(i);
      break;
    case jt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), we(
        e,
        i,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? fs(e, t, r, n) : s & 6 ? e(Ot(t, r, n)) : s & 64 ? hs(e, t, r, n) : s & 128 ? q(e, t.ssContent, r, n) : M(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function we(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    q(e, ls(t[o]), r, n);
}
function fs(e, t, r, n) {
  const o = t.type;
  let { props: s, children: i, shapeFlag: a, scopeId: c, dirs: l } = t, u = `<${o}`;
  l && (s = ds(t, s, l)), s && (u += Bo(s, o)), c && (u += ` ${c}`);
  let d = r, f = t;
  for (; d && f === d.subTree; )
    f = d.vnode, f.scopeId && (u += ` ${f.scopeId}`), d = d.parent;
  if (n && (u += ` ${n}`), e(u + ">"), !xo(o)) {
    let p = !1;
    s && (s.innerHTML ? (p = !0, e(s.innerHTML)) : s.textContent ? (p = !0, e(v(s.textContent))) : o === "textarea" && s.value && (p = !0, e(v(s.value)))), p || (a & 8 ? e(v(i)) : a & 16 && we(
      e,
      i,
      r,
      n
    )), e(`</${o}>`);
  }
}
function ds(e, t, r) {
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
  return Bt(t || {}, ...n);
}
function hs(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || M("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!g(o))
    return M(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  qo(
    e,
    (i) => {
      we(
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
const { isVNode: ps } = je;
function H(e, t, r) {
  if (!e.hasAsync)
    return t + Rt(e);
  let n = t;
  for (let o = r; o < e.length; o += 1) {
    const s = e[o];
    if (g(s)) {
      n += s;
      continue;
    }
    if (K(s))
      return s.then((a) => (e[o] = a, H(e, n, o)));
    const i = H(s, n, 0);
    if (K(i))
      return i.then((a) => (e[o] = a, H(e, "", o)));
    n = i;
  }
  return n;
}
function Tt(e) {
  return H(e, "", 0);
}
function Rt(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    g(n) ? t += n : t += Rt(n);
  }
  return t;
}
async function xt(e, t = {}) {
  if (ps(e))
    return xt(Vt({ render: () => e }), t);
  const r = Dt(e._component, e._props);
  r.appContext = e._context, e.provide(De, t);
  const n = await Ot(r), o = await Tt(n);
  if (await _s(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function _s(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await Tt(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
It();
const gs = z({
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
        location: b(D(t)),
        signature: b(D(n)),
        stack: b(D(r))
      };
    }
    async function s(a) {
      return t.value = a.location, n.value = a.signature, a.stack && (r.value = Be(b(D(r.value)), a.stack)), await ae(() => o());
    }
    _(He, t), _(Me, n), _(Fe, s), _(ct, e.resolver), _(ge, m(() => 0)), _(_e, r);
    function i(a) {
      a.state ? (t.value = a.state.location, r.value = a.state.stack, n.value = a.state.signature) : (window.history.replaceState(o(), "", t.value), window.scroll(0, 0));
    }
    return Kt(() => {
      window.history.replaceState(o(), "", t.value), window.addEventListener("popstate", i);
    }), Ut(() => {
      window.removeEventListener("popstate", i);
    }), () => k(dt, { allowLayouts: !0 });
  }
});
async function bs({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || ys(), s = r({ router: gs, props: { resolver: t, state: o } });
  return n ? await xt(s) : "";
}
function ys() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
function $s() {
  return w(it, null);
}
function Cs() {
  const e = w(lt);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function ms() {
  const e = w(ut);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function As() {
  const e = ms();
  return m(() => {
    if (e && e.value && e.value.location)
      return _t(e.value.location, e.value.query);
  });
}
function Os() {
  const e = w(ft);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
const y = {}, Ts = {
  addEventListener(e, t) {
    y[e] ? y[e].push(t) : y[e] = [t];
  },
  remoteEventListener(e, t) {
    y[e] && (y[e] = y[e].filter((r) => r !== t), y[e].length === 0 && delete y[e]);
  },
  dispatch(e, t) {
    return y[e] && y[e].forEach((r) => r(t)), t;
  }
};
function Rs(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function xs() {
  return {
    install(e) {
      e.component("RouterView", dt), e.component("RouterLink", eo), e.component("FormController", Yn), e.config.globalProperties.$t = no, e.config.globalProperties.$tc = oo, e.config.globalProperties.$route = fo;
    }
  };
}
export {
  Wt as ErrorModal,
  Ts as EventBus,
  it as FormContextInjectionKey,
  Yn as FormControllerComponent,
  ie as Request,
  Se as Response,
  gs as RouterComponent,
  eo as RouterLinkComponent,
  dt as RouterViewComponent,
  ge as StackedViewDepthInjectionKey,
  _e as StackedViewInjectionKey,
  lt as StackedViewLocationInjectionKey,
  ut as StackedViewParentInjectionKey,
  ft as StackedViewQueryInjectionKey,
  ct as StackedViewResolverInjectionKey,
  He as StateLocationInjectionKey,
  Fe as StateManagerInjectionKey,
  Me as StateStackSignatureInjectionKey,
  Wn as createFormContext,
  bs as createFoundationController,
  xs as createOtherSoftwareFoundation,
  vs as getModelFromContext,
  Rs as hash,
  fo as route,
  Es as setModelWithContext,
  no as trans,
  oo as transChoice,
  Be as updateStack,
  _t as url,
  $s as useFromContext,
  Ke as useHttpClient,
  Gt as useLocation,
  qt as useStackSignature,
  zt as useStateManager,
  Qn as useViewDepth,
  Cs as useViewLocation,
  ms as useViewParent,
  As as useViewParentLocation,
  Os as useViewQuery,
  Zn as useViewResolver,
  Xn as useViewStack,
  Jn as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

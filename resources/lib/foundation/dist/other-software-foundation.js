var Ce = Object.defineProperty;
var Oe = (t, e, r) => e in t ? Ce(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var p = (t, e, r) => Oe(t, typeof e != "symbol" ? e + "" : e, r);
import { inject as R, ref as y, defineComponent as z, watch as xe, provide as b, h as L, nextTick as st, computed as V, initDirectivesForSSR as Te, createApp as Re, createVNode as Ae, ssrContextKey as Dt, warn as I, Fragment as Pe, Static as Le, Comment as Ne, Text as ke, mergeProps as je, ssrUtils as Ht, onMounted as De, onBeforeUnmount as He, toRaw as S, toValue as D } from "vue";
const Vt = Symbol("StateLocation"), Ft = Symbol("StateStackSignature"), It = Symbol("StateManager");
function Ve() {
  let t = R(Vt);
  if (!t)
    throw new Error("Location is used out of router context!");
  return t;
}
function Fe() {
  let t = R(Ft);
  if (!t)
    throw new Error("Stack signature is used out of router context!");
  return t;
}
function Ie() {
  let t = R(It);
  if (!t)
    throw new Error("State manager is used out of router context!");
  return { update: t };
}
function Mt(t, e) {
  return "keep" in e ? e.child ? (t.child ? t.child = Mt(t.child, e.child) : t.child = e.child, { ...t }) : { ...t } : { ...e };
}
class wt {
  constructor(e) {
    p(this, "xhr");
    p(this, "status");
    p(this, "success");
    p(this, "fail");
    p(this, "partial");
    p(this, "raw");
    p(this, "message");
    p(this, "content");
    p(this, "location");
    p(this, "signature");
    p(this, "redirect");
    p(this, "stack");
    p(this, "errors");
    if (this.xhr = e, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
    let r = JSON.parse(this.xhr.response);
    this.location = r.location, this.signature = r.signature, this.redirect = r.redirect, this.stack = r.stack, this.errors = r.errors;
  }
}
class at {
  constructor(e, r, n = void 0, o = void 0) {
    p(this, "method");
    p(this, "url");
    p(this, "xhr");
    p(this, "body");
    p(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = e, this.url = r, this.body = n, this.signature = o;
  }
  static send(e, r, n = void 0, o = void 0) {
    return new at(e, r, n, o).send();
  }
  send() {
    return new Promise((e, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        if (this.xhr.readyState !== XMLHttpRequest.DONE || !this.xhr.status)
          return;
        const n = new wt(this.xhr);
        n.fail && r(n), e(n);
      }, this.xhr.onerror = () => {
        r(new wt(this.xhr));
      }, this.xhr.send(this.transform(this.body));
    });
  }
  transform(e) {
    return e instanceof Blob || e instanceof ArrayBuffer || e instanceof FormData || e instanceof URLSearchParams || typeof e == "string" ? e : e === null ? null : (this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), JSON.stringify(e));
  }
  readCookie(e) {
    const r = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
    return r ? decodeURIComponent(r[3]) : "";
  }
}
const Me = {
  modal: void 0,
  listener: void 0,
  show(t) {
    typeof t == "object" && (t = `All requests must receive a valid MVC response, however a plain JSON response was received.<hr>${JSON.stringify(t)}`);
    const e = document.createElement("html");
    e.innerHTML = t, e.querySelectorAll("a").forEach((n) => n.setAttribute("target", "_top")), this.modal = document.createElement("div"), this.modal.style.position = "fixed", this.modal.style.inset = "0", this.modal.style.width = "100vw", this.modal.style.height = "100vh", this.modal.style.padding = "2rem", this.modal.style.boxSizing = "border-box", this.modal.style.backgroundColor = "rgba(0, 0, 0, .6)", this.modal.style.backdropFilter = "blur(0.125rem)", this.modal.style.zIndex = "200000", this.modal.addEventListener("click", () => this.hide());
    const r = document.createElement("iframe");
    if (r.style.backgroundColor = "white", r.style.borderRadius = "0.25rem", r.style.border = "none", r.style.width = "100%", r.style.height = "100%", this.modal.appendChild(r), document.body.prepend(this.modal), document.body.style.overflow = "hidden", !r.contentWindow)
      throw new Error("iframe not yet ready.");
    r.contentWindow.document.open(), r.contentWindow.document.write(e.outerHTML), r.contentWindow.document.close(), this.listener = this.hideOnEscape.bind(this), document.addEventListener("keydown", this.listener);
  },
  hide() {
    this.modal.outerHTML = "", this.modal = void 0, document.body.style.overflow = "visible", document.removeEventListener("keydown", this.listener);
  },
  hideOnEscape(t) {
    t.key === "Escape" && this.hide();
  }
};
function Bt() {
  const t = Ie(), e = Fe();
  async function r(a, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return await at.send(a, c, l, e.value).then(async (d) => await t.update(d).then((h) => d.redirect ? s(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || i(), f ? o(h) : n(h), Promise.resolve(d)))).catch(async (d) => d.status === 422 ? await t.update(d).then(() => Promise.reject(d)) : (APP_DEBUG && Me.show(d.content), Promise.reject(d)));
  }
  function n(a) {
    window.history.pushState(a, "", a.location);
  }
  function o(a) {
    window.history.replaceState(a, "", a.location);
  }
  function i() {
    window.scroll(0, 0);
  }
  async function s(a) {
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
var _ = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Be = "Expected a function", Kt = "__lodash_hash_undefined__", Ut = 1 / 0, qe = 9007199254740991, Ke = "[object Function]", Ue = "[object GeneratorFunction]", Ge = "[object Symbol]", ze = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, We = /^\w*$/, Xe = /^\./, Je = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Ye = /[\\^$.*+?()[\]{}|]/g, Ze = /\\(\\)?/g, Qe = /^\[object .+?Constructor\]$/, tr = /^(?:0|[1-9]\d*)$/, er = typeof _ == "object" && _ && _.Object === Object && _, rr = typeof self == "object" && self && self.Object === Object && self, ct = er || rr || Function("return this")();
function nr(t, e) {
  return t == null ? void 0 : t[e];
}
function or(t) {
  var e = !1;
  if (t != null && typeof t.toString != "function")
    try {
      e = !!(t + "");
    } catch {
    }
  return e;
}
var ir = Array.prototype, sr = Function.prototype, Gt = Object.prototype, tt = ct["__core-js_shared__"], bt = function() {
  var t = /[^.]+$/.exec(tt && tt.keys && tt.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}(), zt = sr.toString, W = Gt.hasOwnProperty, Wt = Gt.toString, ar = RegExp(
  "^" + zt.call(W).replace(Ye, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), St = ct.Symbol, cr = ir.splice, ur = Xt(ct, "Map"), N = Xt(Object, "create"), Et = St ? St.prototype : void 0, vt = Et ? Et.toString : void 0;
function v(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function lr() {
  this.__data__ = N ? N(null) : {};
}
function fr(t) {
  return this.has(t) && delete this.__data__[t];
}
function dr(t) {
  var e = this.__data__;
  if (N) {
    var r = e[t];
    return r === Kt ? void 0 : r;
  }
  return W.call(e, t) ? e[t] : void 0;
}
function pr(t) {
  var e = this.__data__;
  return N ? e[t] !== void 0 : W.call(e, t);
}
function hr(t, e) {
  var r = this.__data__;
  return r[t] = N && e === void 0 ? Kt : e, this;
}
v.prototype.clear = lr;
v.prototype.delete = fr;
v.prototype.get = dr;
v.prototype.has = pr;
v.prototype.set = hr;
function A(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function mr() {
  this.__data__ = [];
}
function gr(t) {
  var e = this.__data__, r = X(e, t);
  if (r < 0)
    return !1;
  var n = e.length - 1;
  return r == n ? e.pop() : cr.call(e, r, 1), !0;
}
function yr(t) {
  var e = this.__data__, r = X(e, t);
  return r < 0 ? void 0 : e[r][1];
}
function _r(t) {
  return X(this.__data__, t) > -1;
}
function wr(t, e) {
  var r = this.__data__, n = X(r, t);
  return n < 0 ? r.push([t, e]) : r[n][1] = e, this;
}
A.prototype.clear = mr;
A.prototype.delete = gr;
A.prototype.get = yr;
A.prototype.has = _r;
A.prototype.set = wr;
function C(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function br() {
  this.__data__ = {
    hash: new v(),
    map: new (ur || A)(),
    string: new v()
  };
}
function Sr(t) {
  return J(this, t).delete(t);
}
function Er(t) {
  return J(this, t).get(t);
}
function vr(t) {
  return J(this, t).has(t);
}
function $r(t, e) {
  return J(this, t).set(t, e), this;
}
C.prototype.clear = br;
C.prototype.delete = Sr;
C.prototype.get = Er;
C.prototype.has = vr;
C.prototype.set = $r;
function Cr(t, e, r) {
  var n = t[e];
  (!(W.call(t, e) && Jt(n, r)) || r === void 0 && !(e in t)) && (t[e] = r);
}
function X(t, e) {
  for (var r = t.length; r--; )
    if (Jt(t[r][0], e))
      return r;
  return -1;
}
function Or(t) {
  if (!M(t) || Nr(t))
    return !1;
  var e = Hr(t) || or(t) ? ar : Qe;
  return e.test(Dr(t));
}
function xr(t, e, r, n) {
  if (!M(t))
    return t;
  e = Pr(e, t) ? [e] : Rr(e);
  for (var o = -1, i = e.length, s = i - 1, a = t; a != null && ++o < i; ) {
    var c = jr(e[o]), l = r;
    if (o != s) {
      var u = a[c];
      l = void 0, l === void 0 && (l = M(u) ? u : Ar(e[o + 1]) ? [] : {});
    }
    Cr(a, c, l), a = a[c];
  }
  return t;
}
function Tr(t) {
  if (typeof t == "string")
    return t;
  if (lt(t))
    return vt ? vt.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -Ut ? "-0" : e;
}
function Rr(t) {
  return Yt(t) ? t : kr(t);
}
function J(t, e) {
  var r = t.__data__;
  return Lr(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
}
function Xt(t, e) {
  var r = nr(t, e);
  return Or(r) ? r : void 0;
}
function Ar(t, e) {
  return e = e ?? qe, !!e && (typeof t == "number" || tr.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
function Pr(t, e) {
  if (Yt(t))
    return !1;
  var r = typeof t;
  return r == "number" || r == "symbol" || r == "boolean" || t == null || lt(t) ? !0 : We.test(t) || !ze.test(t) || e != null && t in Object(e);
}
function Lr(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function Nr(t) {
  return !!bt && bt in t;
}
var kr = ut(function(t) {
  t = Fr(t);
  var e = [];
  return Xe.test(t) && e.push(""), t.replace(Je, function(r, n, o, i) {
    e.push(o ? i.replace(Ze, "$1") : n || r);
  }), e;
});
function jr(t) {
  if (typeof t == "string" || lt(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -Ut ? "-0" : e;
}
function Dr(t) {
  if (t != null) {
    try {
      return zt.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
function ut(t, e) {
  if (typeof t != "function" || e && typeof e != "function")
    throw new TypeError(Be);
  var r = function() {
    var n = arguments, o = e ? e.apply(this, n) : n[0], i = r.cache;
    if (i.has(o))
      return i.get(o);
    var s = t.apply(this, n);
    return r.cache = i.set(o, s), s;
  };
  return r.cache = new (ut.Cache || C)(), r;
}
ut.Cache = C;
function Jt(t, e) {
  return t === e || t !== t && e !== e;
}
var Yt = Array.isArray;
function Hr(t) {
  var e = M(t) ? Wt.call(t) : "";
  return e == Ke || e == Ue;
}
function M(t) {
  var e = typeof t;
  return !!t && (e == "object" || e == "function");
}
function Vr(t) {
  return !!t && typeof t == "object";
}
function lt(t) {
  return typeof t == "symbol" || Vr(t) && Wt.call(t) == Ge;
}
function Fr(t) {
  return t == null ? "" : Tr(t);
}
function Ir(t, e, r) {
  return t == null ? t : xr(t, e, r);
}
var Mr = Ir;
const $t = /* @__PURE__ */ qt(Mr);
var Br = "Expected a function", Zt = "__lodash_hash_undefined__", Qt = 1 / 0, qr = "[object Function]", Kr = "[object GeneratorFunction]", Ur = "[object Symbol]", Gr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, zr = /^\w*$/, Wr = /^\./, Xr = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Jr = /[\\^$.*+?()[\]{}|]/g, Yr = /\\(\\)?/g, Zr = /^\[object .+?Constructor\]$/, Qr = typeof _ == "object" && _ && _.Object === Object && _, tn = typeof self == "object" && self && self.Object === Object && self, ft = Qr || tn || Function("return this")();
function en(t, e) {
  return t == null ? void 0 : t[e];
}
function rn(t) {
  var e = !1;
  if (t != null && typeof t.toString != "function")
    try {
      e = !!(t + "");
    } catch {
    }
  return e;
}
var nn = Array.prototype, on = Function.prototype, te = Object.prototype, et = ft["__core-js_shared__"], Ct = function() {
  var t = /[^.]+$/.exec(et && et.keys && et.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}(), ee = on.toString, dt = te.hasOwnProperty, re = te.toString, sn = RegExp(
  "^" + ee.call(dt).replace(Jr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ot = ft.Symbol, an = nn.splice, cn = ne(ft, "Map"), k = ne(Object, "create"), xt = Ot ? Ot.prototype : void 0, Tt = xt ? xt.toString : void 0;
function $(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function un() {
  this.__data__ = k ? k(null) : {};
}
function ln(t) {
  return this.has(t) && delete this.__data__[t];
}
function fn(t) {
  var e = this.__data__;
  if (k) {
    var r = e[t];
    return r === Zt ? void 0 : r;
  }
  return dt.call(e, t) ? e[t] : void 0;
}
function dn(t) {
  var e = this.__data__;
  return k ? e[t] !== void 0 : dt.call(e, t);
}
function pn(t, e) {
  var r = this.__data__;
  return r[t] = k && e === void 0 ? Zt : e, this;
}
$.prototype.clear = un;
$.prototype.delete = ln;
$.prototype.get = fn;
$.prototype.has = dn;
$.prototype.set = pn;
function P(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function hn() {
  this.__data__ = [];
}
function mn(t) {
  var e = this.__data__, r = Y(e, t);
  if (r < 0)
    return !1;
  var n = e.length - 1;
  return r == n ? e.pop() : an.call(e, r, 1), !0;
}
function gn(t) {
  var e = this.__data__, r = Y(e, t);
  return r < 0 ? void 0 : e[r][1];
}
function yn(t) {
  return Y(this.__data__, t) > -1;
}
function _n(t, e) {
  var r = this.__data__, n = Y(r, t);
  return n < 0 ? r.push([t, e]) : r[n][1] = e, this;
}
P.prototype.clear = hn;
P.prototype.delete = mn;
P.prototype.get = gn;
P.prototype.has = yn;
P.prototype.set = _n;
function O(t) {
  var e = -1, r = t ? t.length : 0;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
function wn() {
  this.__data__ = {
    hash: new $(),
    map: new (cn || P)(),
    string: new $()
  };
}
function bn(t) {
  return Z(this, t).delete(t);
}
function Sn(t) {
  return Z(this, t).get(t);
}
function En(t) {
  return Z(this, t).has(t);
}
function vn(t, e) {
  return Z(this, t).set(t, e), this;
}
O.prototype.clear = wn;
O.prototype.delete = bn;
O.prototype.get = Sn;
O.prototype.has = En;
O.prototype.set = vn;
function Y(t, e) {
  for (var r = t.length; r--; )
    if (kn(t[r][0], e))
      return r;
  return -1;
}
function $n(t, e) {
  e = Tn(e, t) ? [e] : xn(e);
  for (var r = 0, n = e.length; t != null && r < n; )
    t = t[Ln(e[r++])];
  return r && r == n ? t : void 0;
}
function Cn(t) {
  if (!ie(t) || An(t))
    return !1;
  var e = jn(t) || rn(t) ? sn : Zr;
  return e.test(Nn(t));
}
function On(t) {
  if (typeof t == "string")
    return t;
  if (ht(t))
    return Tt ? Tt.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -Qt ? "-0" : e;
}
function xn(t) {
  return oe(t) ? t : Pn(t);
}
function Z(t, e) {
  var r = t.__data__;
  return Rn(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
}
function ne(t, e) {
  var r = en(t, e);
  return Cn(r) ? r : void 0;
}
function Tn(t, e) {
  if (oe(t))
    return !1;
  var r = typeof t;
  return r == "number" || r == "symbol" || r == "boolean" || t == null || ht(t) ? !0 : zr.test(t) || !Gr.test(t) || e != null && t in Object(e);
}
function Rn(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function An(t) {
  return !!Ct && Ct in t;
}
var Pn = pt(function(t) {
  t = Hn(t);
  var e = [];
  return Wr.test(t) && e.push(""), t.replace(Xr, function(r, n, o, i) {
    e.push(o ? i.replace(Yr, "$1") : n || r);
  }), e;
});
function Ln(t) {
  if (typeof t == "string" || ht(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -Qt ? "-0" : e;
}
function Nn(t) {
  if (t != null) {
    try {
      return ee.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
function pt(t, e) {
  if (typeof t != "function" || e && typeof e != "function")
    throw new TypeError(Br);
  var r = function() {
    var n = arguments, o = e ? e.apply(this, n) : n[0], i = r.cache;
    if (i.has(o))
      return i.get(o);
    var s = t.apply(this, n);
    return r.cache = i.set(o, s), s;
  };
  return r.cache = new (pt.Cache || O)(), r;
}
pt.Cache = O;
function kn(t, e) {
  return t === e || t !== t && e !== e;
}
var oe = Array.isArray;
function jn(t) {
  var e = ie(t) ? re.call(t) : "";
  return e == qr || e == Kr;
}
function ie(t) {
  var e = typeof t;
  return !!t && (e == "object" || e == "function");
}
function Dn(t) {
  return !!t && typeof t == "object";
}
function ht(t) {
  return typeof t == "symbol" || Dn(t) && re.call(t) == Ur;
}
function Hn(t) {
  return t == null ? "" : On(t);
}
function Vn(t, e, r) {
  var n = t == null ? void 0 : $n(t, e);
  return n === void 0 ? r : n;
}
var Fn = Vn;
const In = /* @__PURE__ */ qt(Fn), se = Symbol("FormContext");
function Mn(t = {}) {
  const e = y(t), r = y({}), n = y({}), o = y(!1);
  function i(c) {
    $t(n.value, c, !0);
  }
  function s(c, l) {
    return In(e.value, c, l);
  }
  function a(c, l) {
    $t(e.value, c, l);
  }
  return {
    data: e,
    errors: r,
    touched: n,
    processing: o,
    touch: i,
    value: s,
    fill: a
  };
}
function ii(t, e, r) {
  return t && e && (e.touch(t), e.fill(t, r)), r;
}
function si(t, e, r) {
  return t && e ? e.value(t, r) : r;
}
const Bn = z({
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
  setup(t, { slots: e, expose: r }) {
    const n = y(), o = Mn(t.data), i = Bt(), { data: s, processing: a, errors: c, touched: l } = o;
    function u() {
      if (t.onSubmit)
        return t.onSubmit(s.value, o);
      if (!t.action)
        throw new Error("You must either provide action or your custom form handler!");
      return i.dispatch(t.method, t.action, { data: s.value });
    }
    function f(d) {
      d.preventDefault(), d.stopPropagation(), a.value = !0, c.value = {}, l.value = {}, st(() => u().catch((h) => {
        h.status && h.status === 422 && h.errors && (c.value = h.errors);
      }).finally(() => {
        a.value = !1;
      }));
    }
    return xe(() => t.data, (d) => {
      s.value = d;
    }), r({
      ctx: o,
      submit() {
        n.value.dispatchEvent(new SubmitEvent("submit"));
      }
    }), b(se, o), () => L("form", {
      ref: (d) => n.value = d,
      action: t.action,
      method: t.method,
      onSubmit: f
    }, e.default({
      data: s.value,
      processing: a.value,
      errors: c.value,
      touched: l.value,
      ctx: o
    }));
  }
}), ae = Symbol("ViewResolver"), mt = Symbol("StackedView");
function qn(t) {
  return Array.isArray(t) ? t : [t];
}
function Kn() {
  const t = R(ae);
  if (!t)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return t;
}
function Un() {
  const t = R(mt);
  if (!t)
    throw new Error("You're trying to get stacked view out of Router context!");
  return t;
}
const ce = z({
  inheritAttrs: !1,
  name: "RouterView",
  props: {
    allowLayouts: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  setup(t) {
    const e = Kn(), r = Un(), n = V(() => {
      var o;
      return (o = r.value) == null ? void 0 : o.child;
    });
    return b(mt, n), () => {
      if (r.value && "component" in r.value) {
        let o = e(r.value.component);
        o.inheritAttrs = !!o.inheritAttrs;
        let i = L(o, r.value.props);
        return t.allowLayouts && o.layout && (i = qn(o.layout).concat(i).reverse().reduce((s, a) => (a = typeof a == "string" ? e(a) : a, a.inheritAttrs = !!a.inheritAttrs, L(a, null, () => s)))), i;
      }
    };
  }
}), Gn = z({
  name: "RouterLink",
  props: {
    method: { type: String, required: !1, default: "GET" },
    href: { type: String, required: !1 },
    data: { type: [], required: !1 },
    preserveScroll: { type: Boolean, required: !1 },
    replace: { type: Boolean, required: !1 },
    target: { type: String, required: !1 },
    explicit: Boolean
  },
  setup(t, { attrs: e, slots: r }) {
    const n = Ve(), o = Bt(), i = y(!1), s = V(() => {
      var j;
      let u = n.value.replace(/\/$/, ""), f = (j = t.href) == null ? void 0 : j.replace(/\/$/, ""), d = u === f, h = !t.explicit && f && n.value.startsWith(f);
      return d || h;
    }), a = V(() => t.href ? "a" : "button"), c = V(() => t.href ? { target: t.target } : {});
    function l(u) {
      if (!t.href || !zn(u, t.href, t.target))
        return;
      u.preventDefault();
      let { method: f, href: d, data: h, preserveScroll: j, replace: $e } = t;
      i.value = !0, st(() => {
        o.dispatch(f, d, { data: h, preserveScroll: j, replace: $e }).then(() => {
          i.value = !1;
        }).catch(() => {
          i.value = !1;
        });
      });
    }
    return () => L(
      a.value,
      {
        href: t.href,
        onClick: l,
        ...c.value,
        ...e,
        class: [{ active: s.value, pending: i.value }]
      },
      // @ts-ignore
      r.default({ active: s, pending: i })
    );
  }
});
function zn(t, e, r) {
  return r === "_blank" || Wn(e) ? !1 : !(t.defaultPrevented || t.button > 1 || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey);
}
function Wn(t) {
  try {
    let e = window.location.host, r = new URL(t).host;
    return e !== r;
  } catch {
    return !1;
  }
}
/**
* @vue/shared v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Q(t, e) {
  const r = new Set(t.split(","));
  return (n) => r.has(n);
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const B = () => {
}, Xn = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Jn = Object.assign, gt = Array.isArray, T = (t) => typeof t == "function", m = (t) => typeof t == "string", yt = (t) => t !== null && typeof t == "object", q = (t) => (yt(t) || T(t)) && T(t.then) && T(t.catch), Yn = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, Zn = /\B([A-Z])/g, Qn = Yn(
  (t) => t.replace(Zn, "-$1").toLowerCase()
);
let Rt;
const to = () => Rt || (Rt = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ue(t) {
  if (gt(t)) {
    const e = {};
    for (let r = 0; r < t.length; r++) {
      const n = t[r], o = m(n) ? oo(n) : ue(n);
      if (o)
        for (const i in o)
          e[i] = o[i];
    }
    return e;
  } else if (m(t) || yt(t))
    return t;
}
const eo = /;(?![^(]*\))/g, ro = /:([^]+)/, no = /\/\*[^]*?\*\//g;
function oo(t) {
  const e = {};
  return t.replace(no, "").split(eo).forEach((r) => {
    if (r) {
      const n = r.split(ro);
      n.length > 1 && (e[n[0].trim()] = n[1].trim());
    }
  }), e;
}
function io(t) {
  let e = "";
  if (!t || m(t))
    return e;
  for (const r in t) {
    const n = t[r];
    if (m(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : Qn(r);
      e += `${o}:${n};`;
    }
  }
  return e;
}
function le(t) {
  let e = "";
  if (m(t))
    e = t;
  else if (gt(t))
    for (let r = 0; r < t.length; r++) {
      const n = le(t[r]);
      n && (e += n + " ");
    }
  else if (yt(t))
    for (const r in t)
      t[r] && (e += r + " ");
  return e.trim();
}
const so = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", ao = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", co = /* @__PURE__ */ Q(so), uo = /* @__PURE__ */ Q(ao), lo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", fo = /* @__PURE__ */ Q(
  lo + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function po(t) {
  return !!t || t === "";
}
const ho = /[>/="'\u0009\u000a\u000c\u0020]/, rt = {};
function mo(t) {
  if (rt.hasOwnProperty(t))
    return rt[t];
  const e = ho.test(t);
  return e && console.error(`unsafe attribute name: ${t}`), rt[t] = !e;
}
const go = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function yo(t) {
  if (t == null)
    return !1;
  const e = typeof t;
  return e === "string" || e === "number" || e === "boolean";
}
const _o = /["'&<>]/;
function w(t) {
  const e = "" + t, r = _o.exec(e);
  if (!r)
    return e;
  let n = "", o, i, s = 0;
  for (i = r.index; i < e.length; i++) {
    switch (e.charCodeAt(i)) {
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
    s !== i && (n += e.slice(s, i)), s = i + 1, n += o;
  }
  return s !== i ? n + e.slice(s, i) : n;
}
const wo = /^-?>|<!--|-->|--!>|<!-$/g;
function bo(t) {
  return t.replace(wo, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const So = /* @__PURE__ */ Q(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function Eo(t, e) {
  let r = "";
  for (const n in t) {
    if (So(n) || Xn(n) || e === "textarea" && n === "value")
      continue;
    const o = t[n];
    n === "class" ? r += ` class="${$o(o)}"` : n === "style" ? r += ` style="${Co(o)}"` : r += vo(n, o, e);
  }
  return r;
}
function vo(t, e, r) {
  if (!yo(e))
    return "";
  const n = r && (r.indexOf("-") > 0 || co(r)) ? t : go[t] || t.toLowerCase();
  return fo(n) ? po(e) ? ` ${n}` : "" : mo(n) ? e === "" ? ` ${n}` : ` ${n}="${w(e)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function $o(t) {
  return w(le(t));
}
function Co(t) {
  if (!t)
    return "";
  if (m(t))
    return w(t);
  const e = ue(t);
  return w(io(e));
}
function Oo(t, e, r, n, o) {
  t("<!--teleport start-->");
  const i = o.appContext.provides[Dt], s = i.__teleportBuffers || (i.__teleportBuffers = {}), a = s[r] || (s[r] = []), c = a.length;
  let l;
  if (n)
    e(t), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = we();
    f("<!--teleport start anchor-->"), e(f), f("<!--teleport anchor-->"), l = u();
  }
  a.splice(c, 0, l), t("<!--teleport end-->");
}
let At, K = !0;
const fe = [];
function de() {
  fe.push(K), K = !1;
}
function pe() {
  const t = fe.pop();
  K = t === void 0 ? !0 : t;
}
function xo(t, e, r) {
  var n;
  e.get(t) !== t._trackId && (e.set(t, t._trackId), t.deps[t._depsLength] !== e ? t.deps[t._depsLength++] = e : t._depsLength++, process.env.NODE_ENV !== "production" && ((n = t.onTrack) == null || n.call(t, Jn({ effect: t }, r))));
}
const To = (t, e) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = t, r.computed = e, r;
}, Pt = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function Lt(t, e, r) {
  if (K && At) {
    let n = Pt.get(t);
    n || Pt.set(t, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = To(() => n.delete(r))), xo(
      At,
      o,
      process.env.NODE_ENV !== "production" ? {
        target: t,
        type: e,
        key: r
      } : void 0
    );
  }
}
function ot(t) {
  const e = t && t.__v_raw;
  return e ? ot(e) : t;
}
function Ro(t) {
  return !!(t && t.__v_isRef === !0);
}
const E = [];
function Ao(t) {
  E.push(t);
}
function Po() {
  E.pop();
}
let nt = !1;
function U(t, ...e) {
  if (nt) return;
  nt = !0, de();
  const r = E.length ? E[E.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = Lo();
  if (n)
    ge(
      n,
      r,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        t + e.map((i) => {
          var s, a;
          return (a = (s = i.toString) == null ? void 0 : s.call(i)) != null ? a : JSON.stringify(i);
        }).join(""),
        r && r.proxy,
        o.map(
          ({ vnode: i }) => `at <${_e(r, i.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const i = [`[Vue warn]: ${t}`, ...e];
    o.length && i.push(`
`, ...No(o)), console.warn(...i);
  }
  pe(), nt = !1;
}
function Lo() {
  let t = E[E.length - 1];
  if (!t)
    return [];
  const e = [];
  for (; t; ) {
    const r = e[0];
    r && r.vnode === t ? r.recurseCount++ : e.push({
      vnode: t,
      recurseCount: 0
    });
    const n = t.component && t.component.parent;
    t = n && n.vnode;
  }
  return e;
}
function No(t) {
  const e = [];
  return t.forEach((r, n) => {
    e.push(...n === 0 ? [] : [`
`], ...ko(r));
  }), e;
}
function ko({ vnode: t, recurseCount: e }) {
  const r = e > 0 ? `... (${e} recursive calls)` : "", n = t.component ? t.component.parent == null : !1, o = ` at <${_e(
    t.component,
    t.type,
    n
  )}`, i = ">" + r;
  return t.props ? [o, ...jo(t.props), i] : [o + i];
}
function jo(t) {
  const e = [], r = Object.keys(t);
  return r.slice(0, 3).forEach((n) => {
    e.push(...he(n, t[n]));
  }), r.length > 3 && e.push(" ..."), e;
}
function he(t, e, r) {
  return m(e) ? (e = JSON.stringify(e), r ? e : [`${t}=${e}`]) : typeof e == "number" || typeof e == "boolean" || e == null ? r ? e : [`${t}=${e}`] : Ro(e) ? (e = he(t, ot(e.value), !0), r ? e : [`${t}=Ref<`, e, ">"]) : T(e) ? [`${t}=fn${e.name ? `<${e.name}>` : ""}`] : (e = ot(e), r ? e : [`${t}=`, e]);
}
const me = {
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
function ge(t, e, r, n) {
  try {
    return n ? t(...n) : t();
  } catch (o) {
    Do(o, e, r);
  }
}
function Do(t, e, r, n = !0) {
  const o = e ? e.vnode : null;
  if (e) {
    let i = e.parent;
    const s = e.proxy, a = process.env.NODE_ENV !== "production" ? me[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; i; ) {
      const l = i.ec;
      if (l) {
        for (let u = 0; u < l.length; u++)
          if (l[u](t, s, a) === !1)
            return;
      }
      i = i.parent;
    }
    const c = e.appContext.config.errorHandler;
    if (c) {
      de(), ge(
        c,
        null,
        10,
        [t, s, a]
      ), pe();
      return;
    }
  }
  Ho(t, r, o, n);
}
function Ho(t, e, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = me[e];
    if (r && Ao(r), U(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && Po(), n)
      throw t;
    console.error(t);
  } else
    console.error(t);
}
let x, H = [];
function ye(t, e) {
  var r, n;
  x = t, x ? (x.enabled = !0, H.forEach(({ event: o, args: i }) => x.emit(o, ...i)), H = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((e.__VUE_DEVTOOLS_HOOK_REPLAY__ = e.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((i) => {
    ye(i, e);
  }), setTimeout(() => {
    x || (e.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, H = []);
  }, 3e3)) : H = [];
}
{
  const t = to(), e = (r, n) => {
    let o;
    return (o = t[r]) || (o = t[r] = []), o.push(n), (i) => {
      o.length > 1 ? o.forEach((s) => s(i)) : o[0](i);
    };
  };
  e(
    "__VUE_INSTANCE_SETTERS__",
    (r) => r
  ), e(
    "__VUE_SSR_SETTERS__",
    (r) => r
  );
}
process.env.NODE_ENV;
const Vo = /(?:^|[-_])(\w)/g, Fo = (t) => t.replace(Vo, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function Io(t, e = !0) {
  return T(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function _e(t, e, r = !1) {
  let n = Io(e);
  if (!n && e.__file) {
    const o = e.__file.match(/([^/\\]+)\.\w+$/);
    o && (n = o[1]);
  }
  if (!n && t && t.parent) {
    const o = (i) => {
      for (const s in i)
        if (i[s] === e)
          return s;
    };
    n = o(
      t.components || t.parent.type.components
    ) || o(t.appContext.components);
  }
  return n ? Fo(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function Mo(t, e) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: Bo,
  setCurrentRenderingInstance: Nt,
  setupComponent: qo,
  renderComponentRoot: kt,
  normalizeVNode: Ko
} = Ht;
function we() {
  let t = !1;
  const e = [];
  return {
    getBuffer() {
      return e;
    },
    push(r) {
      const n = m(r);
      if (t && n) {
        e[e.length - 1] += r;
        return;
      }
      e.push(r), t = n, (q(r) || gt(r) && r.hasAsync) && (e.hasAsync = !0);
    }
  };
}
function be(t, e = null, r) {
  const n = Bo(t, e, null), o = qo(
    n,
    !0
    /* isSSR */
  ), i = q(o), s = n.sp;
  if (i || s) {
    let a = i ? o : Promise.resolve();
    return s && (a = a.then(
      () => Promise.all(
        s.map((c) => c.call(n.proxy))
      )
    ).catch(B)), a.then(() => jt(n, r));
  } else
    return jt(n, r);
}
function jt(t, e) {
  const r = t.type, { getBuffer: n, push: o } = we();
  if (T(r)) {
    let i = kt(t);
    if (!r.props)
      for (const s in t.attrs)
        s.startsWith("data-v-") && ((i.props || (i.props = {}))[s] = "");
    G(o, t.subTree = i, t, e);
  } else {
    (!t.render || t.render === B) && !t.ssrRender && !r.ssrRender && m(r.template) && (r.ssrRender = Mo(r.template));
    for (const s of t.scope.effects)
      s.computed && (s.computed._dirty = !0, s.computed._cacheable = !0);
    const i = t.ssrRender || r.ssrRender;
    if (i) {
      let s = t.inheritAttrs !== !1 ? t.attrs : void 0, a = !1, c = t;
      for (; ; ) {
        const u = c.vnode.scopeId;
        u && (a || (s = { ...s }, a = !0), s[u] = "");
        const f = c.parent;
        if (f && f.subTree && f.subTree === c.vnode)
          c = f;
        else
          break;
      }
      if (e) {
        a || (s = { ...s });
        const u = e.trim().split(" ");
        for (let f = 0; f < u.length; f++)
          s[u[f]] = "";
      }
      const l = Nt(t);
      try {
        i(
          t.proxy,
          o,
          t,
          s,
          // compiler-optimized bindings
          t.props,
          t.setupState,
          t.data,
          t.ctx
        );
      } finally {
        Nt(l);
      }
    } else if (t.render && t.render !== B)
      G(
        o,
        t.subTree = kt(t),
        t,
        e
      );
    else {
      const s = r.name || r.__file || "<Anonymous>";
      I(`Component ${s} is missing template or render function.`), o("<!---->");
    }
  }
  return n();
}
function G(t, e, r, n) {
  const { type: o, shapeFlag: i, children: s } = e;
  switch (o) {
    case ke:
      t(w(s));
      break;
    case Ne:
      t(
        s ? `<!--${bo(s)}-->` : "<!---->"
      );
      break;
    case Le:
      t(s);
      break;
    case Pe:
      e.slotScopeIds && (n = (n ? n + " " : "") + e.slotScopeIds.join(" ")), t("<!--[-->"), _t(
        t,
        s,
        r,
        n
      ), t("<!--]-->");
      break;
    default:
      i & 1 ? Uo(t, e, r, n) : i & 6 ? t(be(e, r, n)) : i & 64 ? zo(t, e, r, n) : i & 128 ? G(t, e.ssContent, r, n) : I(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function _t(t, e, r, n) {
  for (let o = 0; o < e.length; o++)
    G(t, Ko(e[o]), r, n);
}
function Uo(t, e, r, n) {
  const o = e.type;
  let { props: i, children: s, shapeFlag: a, scopeId: c, dirs: l } = e, u = `<${o}`;
  l && (i = Go(e, i, l)), i && (u += Eo(i, o)), c && (u += ` ${c}`);
  let f = r, d = e;
  for (; f && d === f.subTree; )
    d = f.vnode, d.scopeId && (u += ` ${d.scopeId}`), f = f.parent;
  if (n && (u += ` ${n}`), t(u + ">"), !uo(o)) {
    let h = !1;
    i && (i.innerHTML ? (h = !0, t(i.innerHTML)) : i.textContent ? (h = !0, t(w(i.textContent))) : o === "textarea" && i.value && (h = !0, t(w(i.value)))), h || (a & 8 ? t(w(s)) : a & 16 && _t(
      t,
      s,
      r,
      n
    )), t(`</${o}>`);
  }
}
function Go(t, e, r) {
  const n = [];
  for (let o = 0; o < r.length; o++) {
    const i = r[o], {
      dir: { getSSRProps: s }
    } = i;
    if (s) {
      const a = s(i, t);
      a && n.push(a);
    }
  }
  return je(e || {}, ...n);
}
function zo(t, e, r, n) {
  const o = e.props && e.props.to, i = e.props && e.props.disabled;
  if (!o)
    return i || I("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!m(o))
    return I(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  Oo(
    t,
    (s) => {
      _t(
        s,
        e.children,
        r,
        n
      );
    },
    o,
    i || i === "",
    r
  );
}
const { isVNode: Wo } = Ht;
function F(t, e, r) {
  if (!t.hasAsync)
    return e + Ee(t);
  let n = e;
  for (let o = r; o < t.length; o += 1) {
    const i = t[o];
    if (m(i)) {
      n += i;
      continue;
    }
    if (q(i))
      return i.then((a) => (t[o] = a, F(t, n, o)));
    const s = F(i, n, 0);
    if (q(s))
      return s.then((a) => (t[o] = a, F(t, "", o)));
    n = s;
  }
  return n;
}
function Se(t) {
  return F(t, "", 0);
}
function Ee(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    m(n) ? e += n : e += Ee(n);
  }
  return e;
}
async function ve(t, e = {}) {
  if (Wo(t))
    return ve(Re({ render: () => t }), e);
  const r = Ae(t._component, t._props);
  r.appContext = t._context, t.provide(Dt, e);
  const n = await be(r), o = await Se(n);
  if (await Xo(e), e.__watcherHandles)
    for (const i of e.__watcherHandles)
      i();
  return o;
}
async function Xo(t) {
  if (t.__teleportBuffers) {
    t.teleports = t.teleports || {};
    for (const e in t.__teleportBuffers)
      t.teleports[e] = await Se(
        await Promise.all([t.__teleportBuffers[e]])
      );
  }
}
Te();
const Jo = z({
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
  setup(t) {
    const e = y(t.state.location), r = y(t.state.stack), n = y(t.state.signature);
    function o() {
      return {
        location: S(D(e)),
        signature: S(D(n)),
        stack: S(D(r))
      };
    }
    async function i(a) {
      return e.value = a.location, n.value = a.signature, a.stack && (r.value = Mt(S(D(r.value)), a.stack)), await st(() => o());
    }
    b(Vt, e), b(Ft, n), b(It, i), b(ae, t.resolver), b(mt, r);
    function s(a) {
      a.state ? (e.value = a.state.location, r.value = a.state.stack, n.value = a.state.signature) : (window.history.replaceState(o(), "", e.value), window.scroll(0, 0));
    }
    return De(() => {
      window.history.replaceState(o(), "", e.value), window.addEventListener("popstate", s);
    }), He(() => {
      window.removeEventListener("popstate", s);
    }), () => L(ce, { allowLayouts: !0 });
  }
});
async function ai({ initial: t, resolver: e, setup: r }) {
  const n = typeof window > "u", o = t || Yo(), i = r({ router: Jo, props: { resolver: e, state: o } });
  return n ? await ve(i) : "";
}
function Yo() {
  let t = document.getElementById("os-foundation-state");
  if (!t || !t.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(t.textContent);
}
function ci() {
  let t = R(se);
  if (!t)
    throw new Error("Form context used out of scope!");
  return t;
}
const g = {}, ui = {
  addEventListener(t, e) {
    g[t] ? g[t].push(e) : g[t] = [e];
  },
  remoteEventListener(t, e) {
    g[t] && (g[t] = g[t].filter((r) => r !== e), g[t].length === 0 && delete g[t]);
  },
  dispatch(t, e) {
    return g[t] && g[t].forEach((r) => r(e)), e;
  }
};
function li(t = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(t / 2))), (e) => ("0" + (e & 255).toString(16)).slice(-2)).join("");
}
function Zo(t, e, r, n) {
  const o = new URL(t, n || APP_URL);
  return e && Qo(o.searchParams, e), r && (o.hash = r), o.toString();
}
function Qo(t, e) {
  Object.keys(e).forEach((r) => {
    it(t, r, S(e[r]));
  });
}
function it(t, e, r, n) {
  return n && (e = n + "[" + e + "]"), r == null ? (t.append(e, ""), t) : Array.isArray(r) ? (r.forEach((o, i) => {
    it(t, i.toString(), o, e);
  }), t) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    it(t, o, r[o], e);
  }), t) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), t.append(e, r), t);
}
function fi(t, e = {}, r) {
  return ei(ti(t), e, r);
}
function ti(t) {
  return t.startsWith(APP_FALLBACK_LOCALE) ? t.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_LOCALES.findIndex((e) => t.startsWith(e)) >= 0 || !t.startsWith("web.") ? t : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${t}` : t;
}
function ei(t, e, r) {
  const n = ROUTES[t];
  if (!n)
    throw new Error(`Undefined route: ${t}`);
  const o = ri(n, e), i = Object.keys(e).reduce((s, a) => (n.params.includes(a) || (s[a] = S(e[a])), s), {});
  return Zo(o, i, r, n.domain);
}
function ri(t, e) {
  return t.params.reduce((r, n) => {
    let o = t.binding[n] || "id", i = S(e[n]);
    if (typeof i == "object" && (i = i[o]), !i)
      throw new Error(`Parameter ${n} is required for uri ${t.uri}.`);
    return r.replace(new RegExp(`{${n}??}`), i);
  }, t.uri);
}
function di() {
  return {
    install(t) {
      t.component("RouterView", ce), t.component("RouterLink", Gn), t.component("FormController", Bn);
    }
  };
}
export {
  Me as ErrorModal,
  ui as EventBus,
  se as FormContextInjectionKey,
  Bn as FormControllerComponent,
  at as Request,
  wt as Response,
  Jo as RouterComponent,
  Gn as RouterLinkComponent,
  ce as RouterViewComponent,
  mt as StackedViewInjectionKey,
  ae as StackedViewResolverInjectionKey,
  Vt as StateLocationInjectionKey,
  It as StateManagerInjectionKey,
  Ft as StateStackSignatureInjectionKey,
  Mn as createFormContext,
  ai as createFoundationController,
  di as createOtherSoftwareFoundation,
  si as getModelFromContext,
  li as hash,
  fi as route,
  ii as setModelWithContext,
  Mt as updateStack,
  Zo as url,
  ci as useFromContext,
  Bt as useHttpClient,
  Ve as useLocation,
  Fe as useStackSignature,
  Ie as useStateManager,
  Kn as useViewResolver,
  Un as useViewStack,
  qn as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

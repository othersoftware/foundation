var Vt = Object.defineProperty;
var Dt = (e, t, r) => t in e ? Vt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var h = (e, t, r) => Dt(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as y, ref as m, defineComponent as k, watch as Ht, provide as _, h as T, nextTick as ce, computed as S, onMounted as He, onBeforeUnmount as Me, toRaw as C, initDirectivesForSSR as Mt, createApp as Ft, createVNode as Bt, ssrContextKey as Fe, warn as F, Fragment as Kt, Static as Gt, Comment as Ut, Text as qt, mergeProps as zt, ssrUtils as Be, toValue as D } from "vue";
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
class B extends se {
  constructor(r) {
    super(r);
    h(this, "location");
    h(this, "signature");
    h(this, "redirect");
    h(this, "stack");
    h(this, "toasts");
    h(this, "errors");
    let n = JSON.parse(this.xhr.response);
    this.location = n.location, this.signature = n.signature, this.redirect = n.redirect, this.stack = n.stack, this.errors = n.errors, this.toasts = n.toasts;
  }
}
const Ke = Symbol("StateLocation"), Ge = Symbol("StateStackSignature"), Ue = Symbol("StateManager");
function Wt() {
  let e = y(Ke);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function Yt() {
  let e = y(Ge);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function Jt() {
  let e = y(Ue);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function qe(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = qe(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
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
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? r(new B(this.xhr)) : r(new se(this.xhr)) : t(new B(this.xhr)));
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
const Zt = {
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
function ze() {
  const e = Jt(), t = Yt();
  async function r(i, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return await ue.send(i, c, l, t.value).then(async (d) => await e.update(d).then((p) => d.redirect ? a(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || s(), f ? o(p) : n(p), Promise.resolve(d)))).catch(async (d) => d instanceof B ? await e.update(d).then(() => Promise.reject(d)) : (console.error(d), APP_DEBUG && d.content && Zt.show(d.content), Promise.reject(d)));
  }
  function n(i) {
    window.history.pushState(i, "", i.location);
  }
  function o(i) {
    window.history.replaceState(i, "", i.location);
  }
  function s() {
    window.scroll(0, 0);
  }
  async function a(i) {
    return i.reload ? await new Promise(() => {
      window.location.href = i.target;
    }) : await r("GET", i.target, {
      preserveScroll: !0,
      replace: !1
    });
  }
  return {
    dispatch: r,
    get: async function(i) {
      return await r("GET", i);
    },
    post: async function(i, c = void 0) {
      return await r("POST", i, { data: c, preserveScroll: !0 });
    },
    patch: async function(i, c = void 0) {
      return await r("PATCH", i, { data: c, preserveScroll: !0 });
    },
    put: async function(i, c = void 0) {
      return await r("PUT", i, { data: c, preserveScroll: !0 });
    },
    delete: async function(i, c = void 0) {
      return await r("DELETE", i, { data: c, preserveScroll: !0 });
    }
  };
}
var E = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function We(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xt = "Expected a function", Ye = "__lodash_hash_undefined__", Je = 1 / 0, Qt = 9007199254740991, er = "[object Function]", tr = "[object GeneratorFunction]", rr = "[object Symbol]", nr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, or = /^\w*$/, sr = /^\./, ar = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ir = /[\\^$.*+?()[\]{}|]/g, cr = /\\(\\)?/g, ur = /^\[object .+?Constructor\]$/, lr = /^(?:0|[1-9]\d*)$/, fr = typeof E == "object" && E && E.Object === Object && E, dr = typeof self == "object" && self && self.Object === Object && self, le = fr || dr || Function("return this")();
function hr(e, t) {
  return e == null ? void 0 : e[t];
}
function pr(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var _r = Array.prototype, gr = Function.prototype, Ze = Object.prototype, te = le["__core-js_shared__"], be = function() {
  var e = /[^.]+$/.exec(te && te.keys && te.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), Xe = gr.toString, Y = Ze.hasOwnProperty, Qe = Ze.toString, yr = RegExp(
  "^" + Xe.call(Y).replace(ir, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ce = le.Symbol, mr = _r.splice, wr = et(le, "Map"), j = et(Object, "create"), $e = Ce ? Ce.prototype : void 0, Te = $e ? $e.toString : void 0;
function A(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Sr() {
  this.__data__ = j ? j(null) : {};
}
function Er(e) {
  return this.has(e) && delete this.__data__[e];
}
function vr(e) {
  var t = this.__data__;
  if (j) {
    var r = t[e];
    return r === Ye ? void 0 : r;
  }
  return Y.call(t, e) ? t[e] : void 0;
}
function br(e) {
  var t = this.__data__;
  return j ? t[e] !== void 0 : Y.call(t, e);
}
function Cr(e, t) {
  var r = this.__data__;
  return r[e] = j && t === void 0 ? Ye : t, this;
}
A.prototype.clear = Sr;
A.prototype.delete = Er;
A.prototype.get = vr;
A.prototype.has = br;
A.prototype.set = Cr;
function L(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function $r() {
  this.__data__ = [];
}
function Tr(e) {
  var t = this.__data__, r = J(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : mr.call(t, r, 1), !0;
}
function Ar(e) {
  var t = this.__data__, r = J(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Or(e) {
  return J(this.__data__, e) > -1;
}
function xr(e, t) {
  var r = this.__data__, n = J(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
L.prototype.clear = $r;
L.prototype.delete = Tr;
L.prototype.get = Ar;
L.prototype.has = Or;
L.prototype.set = xr;
function x(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Rr() {
  this.__data__ = {
    hash: new A(),
    map: new (wr || L)(),
    string: new A()
  };
}
function Nr(e) {
  return Z(this, e).delete(e);
}
function Pr(e) {
  return Z(this, e).get(e);
}
function kr(e) {
  return Z(this, e).has(e);
}
function Lr(e, t) {
  return Z(this, e).set(e, t), this;
}
x.prototype.clear = Rr;
x.prototype.delete = Nr;
x.prototype.get = Pr;
x.prototype.has = kr;
x.prototype.set = Lr;
function Ir(e, t, r) {
  var n = e[t];
  (!(Y.call(e, t) && tt(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function J(e, t) {
  for (var r = e.length; r--; )
    if (tt(e[r][0], t))
      return r;
  return -1;
}
function jr(e) {
  if (!K(e) || Kr(e))
    return !1;
  var t = zr(e) || pr(e) ? yr : ur;
  return t.test(qr(e));
}
function Vr(e, t, r, n) {
  if (!K(e))
    return e;
  t = Fr(t, e) ? [t] : Hr(t);
  for (var o = -1, s = t.length, a = s - 1, i = e; i != null && ++o < s; ) {
    var c = Ur(t[o]), l = r;
    if (o != a) {
      var u = i[c];
      l = void 0, l === void 0 && (l = K(u) ? u : Mr(t[o + 1]) ? [] : {});
    }
    Ir(i, c, l), i = i[c];
  }
  return e;
}
function Dr(e) {
  if (typeof e == "string")
    return e;
  if (de(e))
    return Te ? Te.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Je ? "-0" : t;
}
function Hr(e) {
  return rt(e) ? e : Gr(e);
}
function Z(e, t) {
  var r = e.__data__;
  return Br(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function et(e, t) {
  var r = hr(e, t);
  return jr(r) ? r : void 0;
}
function Mr(e, t) {
  return t = t ?? Qt, !!t && (typeof e == "number" || lr.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function Fr(e, t) {
  if (rt(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || de(e) ? !0 : or.test(e) || !nr.test(e) || t != null && e in Object(t);
}
function Br(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Kr(e) {
  return !!be && be in e;
}
var Gr = fe(function(e) {
  e = Yr(e);
  var t = [];
  return sr.test(e) && t.push(""), e.replace(ar, function(r, n, o, s) {
    t.push(o ? s.replace(cr, "$1") : n || r);
  }), t;
});
function Ur(e) {
  if (typeof e == "string" || de(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -Je ? "-0" : t;
}
function qr(e) {
  if (e != null) {
    try {
      return Xe.call(e);
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
    throw new TypeError(Xt);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (fe.Cache || x)(), r;
}
fe.Cache = x;
function tt(e, t) {
  return e === t || e !== e && t !== t;
}
var rt = Array.isArray;
function zr(e) {
  var t = K(e) ? Qe.call(e) : "";
  return t == er || t == tr;
}
function K(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Wr(e) {
  return !!e && typeof e == "object";
}
function de(e) {
  return typeof e == "symbol" || Wr(e) && Qe.call(e) == rr;
}
function Yr(e) {
  return e == null ? "" : Dr(e);
}
function Jr(e, t, r) {
  return e == null ? e : Vr(e, t, r);
}
var Zr = Jr;
const Ae = /* @__PURE__ */ We(Zr);
var Xr = "Expected a function", nt = "__lodash_hash_undefined__", ot = 1 / 0, Qr = "[object Function]", en = "[object GeneratorFunction]", tn = "[object Symbol]", rn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, nn = /^\w*$/, on = /^\./, sn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, an = /[\\^$.*+?()[\]{}|]/g, cn = /\\(\\)?/g, un = /^\[object .+?Constructor\]$/, ln = typeof E == "object" && E && E.Object === Object && E, fn = typeof self == "object" && self && self.Object === Object && self, he = ln || fn || Function("return this")();
function dn(e, t) {
  return e == null ? void 0 : e[t];
}
function hn(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var pn = Array.prototype, _n = Function.prototype, st = Object.prototype, re = he["__core-js_shared__"], Oe = function() {
  var e = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), at = _n.toString, pe = st.hasOwnProperty, it = st.toString, gn = RegExp(
  "^" + at.call(pe).replace(an, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), xe = he.Symbol, yn = pn.splice, mn = ct(he, "Map"), V = ct(Object, "create"), Re = xe ? xe.prototype : void 0, Ne = Re ? Re.toString : void 0;
function O(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function wn() {
  this.__data__ = V ? V(null) : {};
}
function Sn(e) {
  return this.has(e) && delete this.__data__[e];
}
function En(e) {
  var t = this.__data__;
  if (V) {
    var r = t[e];
    return r === nt ? void 0 : r;
  }
  return pe.call(t, e) ? t[e] : void 0;
}
function vn(e) {
  var t = this.__data__;
  return V ? t[e] !== void 0 : pe.call(t, e);
}
function bn(e, t) {
  var r = this.__data__;
  return r[e] = V && t === void 0 ? nt : t, this;
}
O.prototype.clear = wn;
O.prototype.delete = Sn;
O.prototype.get = En;
O.prototype.has = vn;
O.prototype.set = bn;
function I(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Cn() {
  this.__data__ = [];
}
function $n(e) {
  var t = this.__data__, r = X(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : yn.call(t, r, 1), !0;
}
function Tn(e) {
  var t = this.__data__, r = X(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function An(e) {
  return X(this.__data__, e) > -1;
}
function On(e, t) {
  var r = this.__data__, n = X(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
I.prototype.clear = Cn;
I.prototype.delete = $n;
I.prototype.get = Tn;
I.prototype.has = An;
I.prototype.set = On;
function R(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function xn() {
  this.__data__ = {
    hash: new O(),
    map: new (mn || I)(),
    string: new O()
  };
}
function Rn(e) {
  return Q(this, e).delete(e);
}
function Nn(e) {
  return Q(this, e).get(e);
}
function Pn(e) {
  return Q(this, e).has(e);
}
function kn(e, t) {
  return Q(this, e).set(e, t), this;
}
R.prototype.clear = xn;
R.prototype.delete = Rn;
R.prototype.get = Nn;
R.prototype.has = Pn;
R.prototype.set = kn;
function X(e, t) {
  for (var r = e.length; r--; )
    if (Gn(e[r][0], t))
      return r;
  return -1;
}
function Ln(e, t) {
  t = Dn(t, e) ? [t] : Vn(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Bn(t[r++])];
  return r && r == n ? e : void 0;
}
function In(e) {
  if (!lt(e) || Mn(e))
    return !1;
  var t = Un(e) || hn(e) ? gn : un;
  return t.test(Kn(e));
}
function jn(e) {
  if (typeof e == "string")
    return e;
  if (ge(e))
    return Ne ? Ne.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -ot ? "-0" : t;
}
function Vn(e) {
  return ut(e) ? e : Fn(e);
}
function Q(e, t) {
  var r = e.__data__;
  return Hn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function ct(e, t) {
  var r = dn(e, t);
  return In(r) ? r : void 0;
}
function Dn(e, t) {
  if (ut(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ge(e) ? !0 : nn.test(e) || !rn.test(e) || t != null && e in Object(t);
}
function Hn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Mn(e) {
  return !!Oe && Oe in e;
}
var Fn = _e(function(e) {
  e = zn(e);
  var t = [];
  return on.test(e) && t.push(""), e.replace(sn, function(r, n, o, s) {
    t.push(o ? s.replace(cn, "$1") : n || r);
  }), t;
});
function Bn(e) {
  if (typeof e == "string" || ge(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -ot ? "-0" : t;
}
function Kn(e) {
  if (e != null) {
    try {
      return at.call(e);
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
    throw new TypeError(Xr);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (_e.Cache || R)(), r;
}
_e.Cache = R;
function Gn(e, t) {
  return e === t || e !== e && t !== t;
}
var ut = Array.isArray;
function Un(e) {
  var t = lt(e) ? it.call(e) : "";
  return t == Qr || t == en;
}
function lt(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function qn(e) {
  return !!e && typeof e == "object";
}
function ge(e) {
  return typeof e == "symbol" || qn(e) && it.call(e) == tn;
}
function zn(e) {
  return e == null ? "" : jn(e);
}
function Wn(e, t, r) {
  var n = e == null ? void 0 : Ln(e, t);
  return n === void 0 ? r : n;
}
var Yn = Wn;
const Jn = /* @__PURE__ */ We(Yn), ye = Symbol("FormContext");
function Zn(e = {}) {
  const t = m(e), r = m({}), n = m({}), o = m(!1);
  function s(c) {
    Ae(n.value, c, !0);
  }
  function a(c, l) {
    return Jn(t.value, c, l);
  }
  function i(c, l) {
    Ae(t.value, c, l);
  }
  return {
    data: t,
    errors: r,
    touched: n,
    processing: o,
    touch: s,
    value: a,
    fill: i
  };
}
function Os(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function xs(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const Xn = k({
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
    const n = m(), o = Zn(e.data), s = ze(), { data: a, processing: i, errors: c, touched: l } = o;
    function u() {
      n.value.dispatchEvent(new SubmitEvent("submit"));
    }
    function f() {
      if (e.onSubmit)
        return e.onSubmit(a.value, o);
      if (!e.action)
        throw new Error("You must either provide action or your custom form handler!");
      return s.dispatch(e.method, e.action, { data: a.value });
    }
    function d(p) {
      p.preventDefault(), p.stopPropagation(), i.value = !0, c.value = {}, l.value = {}, ce(() => f().catch((b) => {
        b instanceof B && (c.value = b.errors);
      }).finally(() => {
        i.value = !1;
      }));
    }
    return Ht(() => e.data, (p) => {
      a.value = p;
    }), r({
      ctx: o,
      submit: u
    }), _(ye, o), () => T("form", {
      ref: (p) => n.value = p,
      action: e.action,
      method: e.method,
      onSubmit: d
    }, t.default({
      data: a.value,
      processing: i.value,
      errors: c.value,
      touched: l.value,
      ctx: o,
      submit: u
    }));
  }
}), ft = Symbol("ViewResolver"), me = Symbol("StackedView"), we = Symbol("StackedViewDepth"), dt = Symbol("StackedViewParent"), ht = Symbol("StackedViewLocation"), pt = Symbol("StackedViewQuery");
function Qn(e) {
  return Array.isArray(e) ? e : [e];
}
function eo() {
  const e = y(ft);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function to() {
  const e = y(me);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function ro() {
  const e = y(we);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const _t = k({
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
    const t = eo(), r = ro(), n = to(), o = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.location;
    }), s = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.query;
    }), a = S(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return _(me, a), _(we, S(() => r.value + 1)), _(dt, S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.parent;
    })), _(ht, o), _(pt, s), () => {
      if (n.value && "component" in n.value) {
        let i = t(n.value.component);
        i.inheritAttrs = !!i.inheritAttrs;
        let c = T(i, n.value.props);
        return e.allowLayouts && i.layout && (c = Qn(i.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, T(u, null, () => l)))), c;
      }
    };
  }
}), no = k({
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
  setup(e, { attrs: t, slots: r }) {
    const n = Wt(), o = ze(), s = m(!1), a = S(() => {
      var b;
      let u = n.value.replace(/\/$/, ""), f = (b = e.href) == null ? void 0 : b.replace(/\/$/, ""), d = u === f, p = !e.explicit && f && n.value.startsWith(f);
      return d || p;
    }), i = S(() => e.href ? "a" : "button"), c = S(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !oo(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: f, href: d, data: p, preserveScroll: b, replace: jt } = e;
      s.value = !0, ce(() => {
        o.dispatch(f, d, { data: p, preserveScroll: b, replace: jt }).then(() => {
          s.value = !1;
        }).catch(() => {
          s.value = !1;
        });
      });
    }
    return () => T(
      i.value,
      {
        href: e.href,
        onClick: l,
        ...c.value,
        ...t,
        class: [{ active: a.value, pending: s.value, disabled: e.disabled }]
      },
      // @ts-ignore
      r.default({ active: a, pending: s })
    );
  }
});
function oo(e, t, r) {
  return r === "_blank" || so(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function so(e) {
  try {
    let t = window.location.host, r = new URL(e).host;
    return t !== r;
  } catch {
    return !1;
  }
}
const gt = Symbol("ToastRegistry");
function yt() {
  let e = y(gt);
  if (!e)
    throw new Error("Toasts are used out of router context!");
  return e;
}
const ao = k({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = yt();
    return () => T("div", r, t.default({ toasts: n.value }));
  }
}), io = k({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = yt(), o = m();
    function s() {
      clearTimeout(o.value), n.value = n.value.filter((a) => a.id !== e.toast.id);
    }
    return He(() => {
      o.value = setTimeout(() => s(), e.toast.duration * 1e3);
    }), Me(() => {
      clearTimeout(o.value);
    }), () => T("li", r, t.default({ toast: e.toast, close: s }));
  }
});
function co(e, t) {
  return wt(mt(e), t);
}
function uo(e, t, r) {
  return wt(lo(mt(e), t), r);
}
function mt(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function lo(e, t) {
  let r = e.split("|"), n = fo(r, t);
  if (n)
    return n.trim();
  r = po(r);
  let o = _o(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function fo(e, t) {
  for (let r in e) {
    let n = ho(r, t);
    if (n)
      return n;
  }
}
function ho(e, t) {
  const r = /^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s, n = e.match(r);
  if (!n || n.length !== 3)
    return null;
  const o = n[1], s = n[2];
  if (o.includes(",")) {
    const [a, i] = o.split(",", 2);
    if (i === "*" && t >= Number(a))
      return s;
    if (a === "*" && t <= Number(i))
      return s;
    if (t >= Number(a) && t <= Number(i))
      return s;
  }
  return Number(o) == t ? s : null;
}
function po(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function wt(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function _o(e) {
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
function St(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && go(o.searchParams, t), r && (o.hash = r), o.toString();
}
function go(e, t) {
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
function yo(e, t = {}, r) {
  return wo(mo(e), t, r);
}
function mo(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function wo(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = So(n, t), s = Object.keys(t).reduce((a, i) => (n.params.includes(i) || (a[i] = C(t[i])), a), {});
  return St(o, s, r, n.domain);
}
function So(e, t) {
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
const G = () => {
}, Eo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), vo = Object.assign, Se = Array.isArray, P = (e) => typeof e == "function", g = (e) => typeof e == "string", Ee = (e) => e !== null && typeof e == "object", U = (e) => (Ee(e) || P(e)) && P(e.then) && P(e.catch), bo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, Co = /\B([A-Z])/g, $o = bo(
  (e) => e.replace(Co, "-$1").toLowerCase()
);
let Pe;
const To = () => Pe || (Pe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Et(e) {
  if (Se(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = g(n) ? Ro(n) : Et(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (g(e) || Ee(e))
    return e;
}
const Ao = /;(?![^(]*\))/g, Oo = /:([^]+)/, xo = /\/\*[^]*?\*\//g;
function Ro(e) {
  const t = {};
  return e.replace(xo, "").split(Ao).forEach((r) => {
    if (r) {
      const n = r.split(Oo);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function No(e) {
  let t = "";
  if (!e || g(e))
    return t;
  for (const r in e) {
    const n = e[r];
    if (g(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : $o(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function vt(e) {
  let t = "";
  if (g(e))
    t = e;
  else if (Se(e))
    for (let r = 0; r < e.length; r++) {
      const n = vt(e[r]);
      n && (t += n + " ");
    }
  else if (Ee(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const Po = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", ko = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Lo = /* @__PURE__ */ ee(Po), Io = /* @__PURE__ */ ee(ko), jo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Vo = /* @__PURE__ */ ee(
  jo + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function Do(e) {
  return !!e || e === "";
}
const Ho = /[>/="'\u0009\u000a\u000c\u0020]/, ne = {};
function Mo(e) {
  if (ne.hasOwnProperty(e))
    return ne[e];
  const t = Ho.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), ne[e] = !t;
}
const Fo = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function Bo(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const Ko = /["'&<>]/;
function v(e) {
  const t = "" + e, r = Ko.exec(t);
  if (!r)
    return t;
  let n = "", o, s, a = 0;
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
    a !== s && (n += t.slice(a, s)), a = s + 1, n += o;
  }
  return a !== s ? n + t.slice(a, s) : n;
}
const Go = /^-?>|<!--|-->|--!>|<!-$/g;
function Uo(e) {
  return e.replace(Go, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const qo = /* @__PURE__ */ ee(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function zo(e, t) {
  let r = "";
  for (const n in e) {
    if (qo(n) || Eo(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${Yo(o)}"` : n === "style" ? r += ` style="${Jo(o)}"` : r += Wo(n, o, t);
  }
  return r;
}
function Wo(e, t, r) {
  if (!Bo(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || Lo(r)) ? e : Fo[e] || e.toLowerCase();
  return Vo(n) ? Do(t) ? ` ${n}` : "" : Mo(n) ? t === "" ? ` ${n}` : ` ${n}="${v(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function Yo(e) {
  return v(vt(e));
}
function Jo(e) {
  if (!e)
    return "";
  if (g(e))
    return v(e);
  const t = Et(e);
  return v(No(t));
}
function Zo(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[Fe], a = s.__teleportBuffers || (s.__teleportBuffers = {}), i = a[r] || (a[r] = []), c = i.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = Nt();
    f("<!--teleport start anchor-->"), t(f), f("<!--teleport anchor-->"), l = u();
  }
  i.splice(c, 0, l), e("<!--teleport end-->");
}
let ke, q = !0;
const bt = [];
function Ct() {
  bt.push(q), q = !1;
}
function $t() {
  const e = bt.pop();
  q = e === void 0 ? !0 : e;
}
function Xo(e, t, r) {
  var n;
  t.get(e) !== e._trackId && (t.set(e, e._trackId), e.deps[e._depsLength] !== t ? e.deps[e._depsLength++] = t : e._depsLength++, process.env.NODE_ENV !== "production" && ((n = e.onTrack) == null || n.call(e, vo({ effect: e }, r))));
}
const Qo = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, Le = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function Ie(e, t, r) {
  if (q && ke) {
    let n = Le.get(e);
    n || Le.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = Qo(() => n.delete(r))), Xo(
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
function es(e) {
  return !!(e && e.__v_isRef === !0);
}
const $ = [];
function ts(e) {
  $.push(e);
}
function rs() {
  $.pop();
}
let oe = !1;
function z(e, ...t) {
  if (oe) return;
  oe = !0, Ct();
  const r = $.length ? $[$.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = ns();
  if (n)
    Ot(
      n,
      r,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((s) => {
          var a, i;
          return (i = (a = s.toString) == null ? void 0 : a.call(s)) != null ? i : JSON.stringify(s);
        }).join(""),
        r && r.proxy,
        o.map(
          ({ vnode: s }) => `at <${Rt(r, s.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const s = [`[Vue warn]: ${e}`, ...t];
    o.length && s.push(`
`, ...os(o)), console.warn(...s);
  }
  $t(), oe = !1;
}
function ns() {
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
function os(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ...ss(r));
  }), t;
}
function ss({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${Rt(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...as(e.props), s] : [o + s];
}
function as(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...Tt(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function Tt(e, t, r) {
  return g(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : es(t) ? (t = Tt(e, ie(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : P(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = ie(t), r ? t : [`${e}=`, t]);
}
const At = {
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
function Ot(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    is(o, t, r);
  }
}
function is(e, t, r, n = !0) {
  const o = t ? t.vnode : null;
  if (t) {
    let s = t.parent;
    const a = t.proxy, i = process.env.NODE_ENV !== "production" ? At[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; s; ) {
      const l = s.ec;
      if (l) {
        for (let u = 0; u < l.length; u++)
          if (l[u](e, a, i) === !1)
            return;
      }
      s = s.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      Ct(), Ot(
        c,
        null,
        10,
        [e, a, i]
      ), $t();
      return;
    }
  }
  cs(e, r, o, n);
}
function cs(e, t, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = At[t];
    if (r && ts(r), z(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && rs(), n)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let N, H = [];
function xt(e, t) {
  var r, n;
  N = e, N ? (N.enabled = !0, H.forEach(({ event: o, args: s }) => N.emit(o, ...s)), H = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    xt(s, t);
  }), setTimeout(() => {
    N || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, H = []);
  }, 3e3)) : H = [];
}
{
  const e = To(), t = (r, n) => {
    let o;
    return (o = e[r]) || (o = e[r] = []), o.push(n), (s) => {
      o.length > 1 ? o.forEach((a) => a(s)) : o[0](s);
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
const us = /(?:^|[-_])(\w)/g, ls = (e) => e.replace(us, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function fs(e, t = !0) {
  return P(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Rt(e, t, r = !1) {
  let n = fs(t);
  if (!n && t.__file) {
    const o = t.__file.match(/([^/\\]+)\.\w+$/);
    o && (n = o[1]);
  }
  if (!n && e && e.parent) {
    const o = (s) => {
      for (const a in s)
        if (s[a] === t)
          return a;
    };
    n = o(
      e.components || e.parent.type.components
    ) || o(e.appContext.components);
  }
  return n ? ls(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function ds(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: hs,
  setCurrentRenderingInstance: je,
  setupComponent: ps,
  renderComponentRoot: Ve,
  normalizeVNode: _s
} = Be;
function Nt() {
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
function Pt(e, t = null, r) {
  const n = hs(e, t, null), o = ps(
    n,
    !0
    /* isSSR */
  ), s = U(o), a = n.sp;
  if (s || a) {
    let i = s ? o : Promise.resolve();
    return a && (i = i.then(
      () => Promise.all(
        a.map((c) => c.call(n.proxy))
      )
    ).catch(G)), i.then(() => De(n, r));
  } else
    return De(n, r);
}
function De(e, t) {
  const r = e.type, { getBuffer: n, push: o } = Nt();
  if (P(r)) {
    let s = Ve(e);
    if (!r.props)
      for (const a in e.attrs)
        a.startsWith("data-v-") && ((s.props || (s.props = {}))[a] = "");
    W(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === G) && !e.ssrRender && !r.ssrRender && g(r.template) && (r.ssrRender = ds(r.template));
    for (const a of e.scope.effects)
      a.computed && (a.computed._dirty = !0, a.computed._cacheable = !0);
    const s = e.ssrRender || r.ssrRender;
    if (s) {
      let a = e.inheritAttrs !== !1 ? e.attrs : void 0, i = !1, c = e;
      for (; ; ) {
        const u = c.vnode.scopeId;
        u && (i || (a = { ...a }, i = !0), a[u] = "");
        const f = c.parent;
        if (f && f.subTree && f.subTree === c.vnode)
          c = f;
        else
          break;
      }
      if (t) {
        i || (a = { ...a });
        const u = t.trim().split(" ");
        for (let f = 0; f < u.length; f++)
          a[u[f]] = "";
      }
      const l = je(e);
      try {
        s(
          e.proxy,
          o,
          e,
          a,
          // compiler-optimized bindings
          e.props,
          e.setupState,
          e.data,
          e.ctx
        );
      } finally {
        je(l);
      }
    } else if (e.render && e.render !== G)
      W(
        o,
        e.subTree = Ve(e),
        e,
        t
      );
    else {
      const a = r.name || r.__file || "<Anonymous>";
      F(`Component ${a} is missing template or render function.`), o("<!---->");
    }
  }
  return n();
}
function W(e, t, r, n) {
  const { type: o, shapeFlag: s, children: a } = t;
  switch (o) {
    case qt:
      e(v(a));
      break;
    case Ut:
      e(
        a ? `<!--${Uo(a)}-->` : "<!---->"
      );
      break;
    case Gt:
      e(a);
      break;
    case Kt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), ve(
        e,
        a,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? gs(e, t, r, n) : s & 6 ? e(Pt(t, r, n)) : s & 64 ? ms(e, t, r, n) : s & 128 ? W(e, t.ssContent, r, n) : F(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function ve(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    W(e, _s(t[o]), r, n);
}
function gs(e, t, r, n) {
  const o = t.type;
  let { props: s, children: a, shapeFlag: i, scopeId: c, dirs: l } = t, u = `<${o}`;
  l && (s = ys(t, s, l)), s && (u += zo(s, o)), c && (u += ` ${c}`);
  let f = r, d = t;
  for (; f && d === f.subTree; )
    d = f.vnode, d.scopeId && (u += ` ${d.scopeId}`), f = f.parent;
  if (n && (u += ` ${n}`), e(u + ">"), !Io(o)) {
    let p = !1;
    s && (s.innerHTML ? (p = !0, e(s.innerHTML)) : s.textContent ? (p = !0, e(v(s.textContent))) : o === "textarea" && s.value && (p = !0, e(v(s.value)))), p || (i & 8 ? e(v(a)) : i & 16 && ve(
      e,
      a,
      r,
      n
    )), e(`</${o}>`);
  }
}
function ys(e, t, r) {
  const n = [];
  for (let o = 0; o < r.length; o++) {
    const s = r[o], {
      dir: { getSSRProps: a }
    } = s;
    if (a) {
      const i = a(s, e);
      i && n.push(i);
    }
  }
  return zt(t || {}, ...n);
}
function ms(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || F("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!g(o))
    return F(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  Zo(
    e,
    (a) => {
      ve(
        a,
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
const { isVNode: ws } = Be;
function M(e, t, r) {
  if (!e.hasAsync)
    return t + Lt(e);
  let n = t;
  for (let o = r; o < e.length; o += 1) {
    const s = e[o];
    if (g(s)) {
      n += s;
      continue;
    }
    if (U(s))
      return s.then((i) => (e[o] = i, M(e, n, o)));
    const a = M(s, n, 0);
    if (U(a))
      return a.then((i) => (e[o] = i, M(e, "", o)));
    n = a;
  }
  return n;
}
function kt(e) {
  return M(e, "", 0);
}
function Lt(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    g(n) ? t += n : t += Lt(n);
  }
  return t;
}
async function It(e, t = {}) {
  if (ws(e))
    return It(Ft({ render: () => e }), t);
  const r = Bt(e._component, e._props);
  r.appContext = e._context, e.provide(Fe, t);
  const n = await Pt(r), o = await kt(n);
  if (await Ss(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function Ss(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await kt(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
Mt();
const Es = k({
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
    const t = m(e.state.location), r = m(e.state.stack), n = m(e.state.signature), o = m(e.state.toasts);
    function s() {
      return {
        location: C(D(t)),
        signature: C(D(n)),
        stack: C(D(r))
      };
    }
    async function a(c) {
      return t.value = c.location, n.value = c.signature, c.stack && (r.value = qe(C(D(r.value)), c.stack)), c.toasts && c.toasts.length > 0 && (o.value = [...o.value, ...c.toasts]), await ce(() => s());
    }
    _(Ke, t), _(Ge, n), _(Ue, a), _(ft, e.resolver), _(we, S(() => 0)), _(me, r), _(gt, o);
    function i(c) {
      c.state ? (t.value = c.state.location, r.value = c.state.stack, n.value = c.state.signature) : (window.history.replaceState(s(), "", t.value), window.scroll(0, 0));
    }
    return He(() => {
      window.history.replaceState(s(), "", t.value), window.addEventListener("popstate", i);
    }), Me(() => {
      window.removeEventListener("popstate", i);
    }), () => T(_t, { allowLayouts: !0 });
  }
});
async function Rs({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || vs(), s = r({ router: Es, props: { resolver: t, state: o } });
  return n ? await It(s) : "";
}
function vs() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
function Ns() {
  return y(ye, null);
}
function Ps() {
  let e = y(ye);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function ks() {
  const e = y(ht);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function bs() {
  const e = y(dt);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function Ls() {
  const e = bs();
  return S(() => {
    if (e && e.value && e.value.location)
      return St(e.value.location, e.value.query);
  });
}
function Is() {
  const e = y(pt);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
const w = {}, js = {
  addEventListener(e, t) {
    w[e] ? w[e].push(t) : w[e] = [t];
  },
  remoteEventListener(e, t) {
    w[e] && (w[e] = w[e].filter((r) => r !== t), w[e].length === 0 && delete w[e]);
  },
  dispatch(e, t) {
    return w[e] && w[e].forEach((r) => r(t)), t;
  }
};
function Cs(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function Vs(e) {
  return !Cs(e);
}
function Ds(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
var $s = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))($s || {});
function Hs() {
  return {
    install(e) {
      e.component("RouterView", _t), e.component("RouterLink", no), e.component("FormController", Xn), e.component("ToastController", ao), e.component("Toast", io), e.config.globalProperties.$t = co, e.config.globalProperties.$tc = uo, e.config.globalProperties.$route = yo;
    }
  };
}
export {
  B as CompleteResponse,
  Zt as ErrorModal,
  js as EventBus,
  ye as FormContextInjectionKey,
  Xn as FormControllerComponent,
  ue as Request,
  se as Response,
  Es as RouterComponent,
  no as RouterLinkComponent,
  _t as RouterViewComponent,
  we as StackedViewDepthInjectionKey,
  me as StackedViewInjectionKey,
  ht as StackedViewLocationInjectionKey,
  dt as StackedViewParentInjectionKey,
  pt as StackedViewQueryInjectionKey,
  ft as StackedViewResolverInjectionKey,
  Ke as StateLocationInjectionKey,
  Ue as StateManagerInjectionKey,
  Ge as StateStackSignatureInjectionKey,
  io as ToastComponent,
  ao as ToastControllerComponent,
  $s as ToastKind,
  gt as ToastRegistryInjectionKey,
  Cs as blank,
  Zn as createFormContext,
  Rs as createFoundationController,
  Hs as createOtherSoftwareFoundation,
  Vs as filled,
  xs as getModelFromContext,
  Ds as hash,
  yo as route,
  Os as setModelWithContext,
  co as trans,
  uo as transChoice,
  qe as updateStack,
  St as url,
  Ns as useFromContext,
  ze as useHttpClient,
  Wt as useLocation,
  Ps as usePersistentFormContext,
  Yt as useStackSignature,
  Jt as useStateManager,
  yt as useToasts,
  ro as useViewDepth,
  ks as useViewLocation,
  bs as useViewParent,
  Ls as useViewParentLocation,
  Is as useViewQuery,
  eo as useViewResolver,
  to as useViewStack,
  Qn as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

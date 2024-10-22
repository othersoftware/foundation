var Dt = Object.defineProperty;
var Ht = (e, t, r) => t in e ? Dt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var p = (e, t, r) => Ht(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as m, ref as g, defineComponent as x, watch as Mt, provide as _, h as C, nextTick as Y, computed as S, onMounted as le, onBeforeUnmount as fe, toRaw as $, initDirectivesForSSR as Ft, createApp as Bt, createVNode as Kt, ssrContextKey as Ke, warn as F, Fragment as Gt, Static as Ut, Comment as qt, Text as zt, mergeProps as Wt, ssrUtils as Ge, toValue as D } from "vue";
class ae {
  constructor(t) {
    p(this, "xhr");
    p(this, "status");
    p(this, "success");
    p(this, "fail");
    p(this, "partial");
    p(this, "raw");
    p(this, "message");
    p(this, "content");
    if (this.xhr = t, this.xhr.getResponseHeader("x-stack-router"))
      throw new Error("Invalid response for MVC HTTP client.");
    this.status = this.xhr.status, this.success = this.xhr.status >= 200 && this.xhr.status < 300, this.fail = !this.success, this.content = this.xhr.response, this.message = this.xhr.statusText, this.partial = !!this.xhr.getResponseHeader("x-partial"), this.raw = !!this.xhr.getResponseHeader("x-raw");
  }
}
class B extends ae {
  constructor(r) {
    super(r);
    p(this, "location");
    p(this, "signature");
    p(this, "redirect");
    p(this, "stack");
    p(this, "toasts");
    p(this, "errors");
    let n = JSON.parse(this.xhr.response);
    this.location = n.location, this.signature = n.signature, this.redirect = n.redirect, this.stack = n.stack, this.errors = n.errors, this.toasts = n.toasts;
  }
}
const Ue = Symbol("StateLocation"), qe = Symbol("StateStackSignature"), ze = Symbol("StateManager");
function Yt() {
  let e = m(Ue);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function Jt() {
  let e = m(qe);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function Zt() {
  let e = m(ze);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function We(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = We(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class de {
  constructor(t, r, n = void 0, o = void 0) {
    p(this, "method");
    p(this, "url");
    p(this, "xhr");
    p(this, "body");
    p(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = r, this.body = n, this.signature = o;
  }
  static send(t, r, n = void 0, o = void 0) {
    return new de(t, r, n, o).send();
  }
  send() {
    return new Promise((t, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? r(new B(this.xhr)) : r(new ae(this.xhr)) : t(new B(this.xhr)));
      }, this.xhr.onerror = () => {
        r(new ae(this.xhr));
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
const Xt = {
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
}, w = {}, ie = {
  addEventListener(e, t) {
    w[e] ? w[e].push(t) : w[e] = [t];
  },
  removeEventListener(e, t) {
    w[e] && (w[e] = w[e].filter((r) => r !== t), w[e].length === 0 && delete w[e]);
  },
  dispatch(e, t) {
    return w[e] && w[e].forEach((r) => r(t)), t;
  }
};
function he() {
  const e = Zt(), t = Jt();
  async function r(i, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return await de.send(i, c, l, t.value).then(async (d) => await e.update(d).then((h) => d.redirect ? a(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || s(), f ? o(h) : n(h), Promise.resolve(d)))).catch(async (d) => d instanceof B ? await e.update(d).then(() => Promise.reject(d)) : d.status === 423 ? (ie.dispatch("password.confirm", { method: i, url: c, options: { data: l, preserveScroll: u, replace: f } }), Promise.reject(d)) : (console.error(d), APP_DEBUG && d.content && Xt.show(d.content), Promise.reject(d)));
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
function Ye(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qt = "Expected a function", Je = "__lodash_hash_undefined__", Ze = 1 / 0, er = 9007199254740991, tr = "[object Function]", rr = "[object GeneratorFunction]", nr = "[object Symbol]", or = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, sr = /^\w*$/, ar = /^\./, ir = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, cr = /[\\^$.*+?()[\]{}|]/g, ur = /\\(\\)?/g, lr = /^\[object .+?Constructor\]$/, fr = /^(?:0|[1-9]\d*)$/, dr = typeof E == "object" && E && E.Object === Object && E, hr = typeof self == "object" && self && self.Object === Object && self, pe = dr || hr || Function("return this")();
function pr(e, t) {
  return e == null ? void 0 : e[t];
}
function _r(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var gr = Array.prototype, yr = Function.prototype, Xe = Object.prototype, re = pe["__core-js_shared__"], Oe = function() {
  var e = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), Qe = yr.toString, J = Xe.hasOwnProperty, et = Xe.toString, mr = RegExp(
  "^" + Qe.call(J).replace(cr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ae = pe.Symbol, wr = gr.splice, Sr = tt(pe, "Map"), j = tt(Object, "create"), xe = Ae ? Ae.prototype : void 0, Re = xe ? xe.toString : void 0;
function O(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Er() {
  this.__data__ = j ? j(null) : {};
}
function vr(e) {
  return this.has(e) && delete this.__data__[e];
}
function Cr(e) {
  var t = this.__data__;
  if (j) {
    var r = t[e];
    return r === Je ? void 0 : r;
  }
  return J.call(t, e) ? t[e] : void 0;
}
function br(e) {
  var t = this.__data__;
  return j ? t[e] !== void 0 : J.call(t, e);
}
function $r(e, t) {
  var r = this.__data__;
  return r[e] = j && t === void 0 ? Je : t, this;
}
O.prototype.clear = Er;
O.prototype.delete = vr;
O.prototype.get = Cr;
O.prototype.has = br;
O.prototype.set = $r;
function k(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Tr() {
  this.__data__ = [];
}
function Or(e) {
  var t = this.__data__, r = Z(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : wr.call(t, r, 1), !0;
}
function Ar(e) {
  var t = this.__data__, r = Z(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function xr(e) {
  return Z(this.__data__, e) > -1;
}
function Rr(e, t) {
  var r = this.__data__, n = Z(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
k.prototype.clear = Tr;
k.prototype.delete = Or;
k.prototype.get = Ar;
k.prototype.has = xr;
k.prototype.set = Rr;
function R(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Pr() {
  this.__data__ = {
    hash: new O(),
    map: new (Sr || k)(),
    string: new O()
  };
}
function Nr(e) {
  return X(this, e).delete(e);
}
function Lr(e) {
  return X(this, e).get(e);
}
function kr(e) {
  return X(this, e).has(e);
}
function Ir(e, t) {
  return X(this, e).set(e, t), this;
}
R.prototype.clear = Pr;
R.prototype.delete = Nr;
R.prototype.get = Lr;
R.prototype.has = kr;
R.prototype.set = Ir;
function jr(e, t, r) {
  var n = e[t];
  (!(J.call(e, t) && rt(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function Z(e, t) {
  for (var r = e.length; r--; )
    if (rt(e[r][0], t))
      return r;
  return -1;
}
function Vr(e) {
  if (!K(e) || Gr(e))
    return !1;
  var t = Wr(e) || _r(e) ? mr : lr;
  return t.test(zr(e));
}
function Dr(e, t, r, n) {
  if (!K(e))
    return e;
  t = Br(t, e) ? [t] : Mr(t);
  for (var o = -1, s = t.length, a = s - 1, i = e; i != null && ++o < s; ) {
    var c = qr(t[o]), l = r;
    if (o != a) {
      var u = i[c];
      l = void 0, l === void 0 && (l = K(u) ? u : Fr(t[o + 1]) ? [] : {});
    }
    jr(i, c, l), i = i[c];
  }
  return e;
}
function Hr(e) {
  if (typeof e == "string")
    return e;
  if (ge(e))
    return Re ? Re.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Ze ? "-0" : t;
}
function Mr(e) {
  return nt(e) ? e : Ur(e);
}
function X(e, t) {
  var r = e.__data__;
  return Kr(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function tt(e, t) {
  var r = pr(e, t);
  return Vr(r) ? r : void 0;
}
function Fr(e, t) {
  return t = t ?? er, !!t && (typeof e == "number" || fr.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function Br(e, t) {
  if (nt(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ge(e) ? !0 : sr.test(e) || !or.test(e) || t != null && e in Object(t);
}
function Kr(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Gr(e) {
  return !!Oe && Oe in e;
}
var Ur = _e(function(e) {
  e = Jr(e);
  var t = [];
  return ar.test(e) && t.push(""), e.replace(ir, function(r, n, o, s) {
    t.push(o ? s.replace(ur, "$1") : n || r);
  }), t;
});
function qr(e) {
  if (typeof e == "string" || ge(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -Ze ? "-0" : t;
}
function zr(e) {
  if (e != null) {
    try {
      return Qe.call(e);
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
    throw new TypeError(Qt);
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
function rt(e, t) {
  return e === t || e !== e && t !== t;
}
var nt = Array.isArray;
function Wr(e) {
  var t = K(e) ? et.call(e) : "";
  return t == tr || t == rr;
}
function K(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Yr(e) {
  return !!e && typeof e == "object";
}
function ge(e) {
  return typeof e == "symbol" || Yr(e) && et.call(e) == nr;
}
function Jr(e) {
  return e == null ? "" : Hr(e);
}
function Zr(e, t, r) {
  return e == null ? e : Dr(e, t, r);
}
var Xr = Zr;
const Pe = /* @__PURE__ */ Ye(Xr);
var Qr = "Expected a function", ot = "__lodash_hash_undefined__", st = 1 / 0, en = "[object Function]", tn = "[object GeneratorFunction]", rn = "[object Symbol]", nn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, on = /^\w*$/, sn = /^\./, an = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, cn = /[\\^$.*+?()[\]{}|]/g, un = /\\(\\)?/g, ln = /^\[object .+?Constructor\]$/, fn = typeof E == "object" && E && E.Object === Object && E, dn = typeof self == "object" && self && self.Object === Object && self, ye = fn || dn || Function("return this")();
function hn(e, t) {
  return e == null ? void 0 : e[t];
}
function pn(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var _n = Array.prototype, gn = Function.prototype, at = Object.prototype, ne = ye["__core-js_shared__"], Ne = function() {
  var e = /[^.]+$/.exec(ne && ne.keys && ne.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), it = gn.toString, me = at.hasOwnProperty, ct = at.toString, yn = RegExp(
  "^" + it.call(me).replace(cn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Le = ye.Symbol, mn = _n.splice, wn = ut(ye, "Map"), V = ut(Object, "create"), ke = Le ? Le.prototype : void 0, Ie = ke ? ke.toString : void 0;
function A(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Sn() {
  this.__data__ = V ? V(null) : {};
}
function En(e) {
  return this.has(e) && delete this.__data__[e];
}
function vn(e) {
  var t = this.__data__;
  if (V) {
    var r = t[e];
    return r === ot ? void 0 : r;
  }
  return me.call(t, e) ? t[e] : void 0;
}
function Cn(e) {
  var t = this.__data__;
  return V ? t[e] !== void 0 : me.call(t, e);
}
function bn(e, t) {
  var r = this.__data__;
  return r[e] = V && t === void 0 ? ot : t, this;
}
A.prototype.clear = Sn;
A.prototype.delete = En;
A.prototype.get = vn;
A.prototype.has = Cn;
A.prototype.set = bn;
function I(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function $n() {
  this.__data__ = [];
}
function Tn(e) {
  var t = this.__data__, r = Q(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : mn.call(t, r, 1), !0;
}
function On(e) {
  var t = this.__data__, r = Q(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function An(e) {
  return Q(this.__data__, e) > -1;
}
function xn(e, t) {
  var r = this.__data__, n = Q(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
I.prototype.clear = $n;
I.prototype.delete = Tn;
I.prototype.get = On;
I.prototype.has = An;
I.prototype.set = xn;
function P(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Rn() {
  this.__data__ = {
    hash: new A(),
    map: new (wn || I)(),
    string: new A()
  };
}
function Pn(e) {
  return ee(this, e).delete(e);
}
function Nn(e) {
  return ee(this, e).get(e);
}
function Ln(e) {
  return ee(this, e).has(e);
}
function kn(e, t) {
  return ee(this, e).set(e, t), this;
}
P.prototype.clear = Rn;
P.prototype.delete = Pn;
P.prototype.get = Nn;
P.prototype.has = Ln;
P.prototype.set = kn;
function Q(e, t) {
  for (var r = e.length; r--; )
    if (Un(e[r][0], t))
      return r;
  return -1;
}
function In(e, t) {
  t = Hn(t, e) ? [t] : Dn(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Kn(t[r++])];
  return r && r == n ? e : void 0;
}
function jn(e) {
  if (!ft(e) || Fn(e))
    return !1;
  var t = qn(e) || pn(e) ? yn : ln;
  return t.test(Gn(e));
}
function Vn(e) {
  if (typeof e == "string")
    return e;
  if (Se(e))
    return Ie ? Ie.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -st ? "-0" : t;
}
function Dn(e) {
  return lt(e) ? e : Bn(e);
}
function ee(e, t) {
  var r = e.__data__;
  return Mn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function ut(e, t) {
  var r = hn(e, t);
  return jn(r) ? r : void 0;
}
function Hn(e, t) {
  if (lt(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || Se(e) ? !0 : on.test(e) || !nn.test(e) || t != null && e in Object(t);
}
function Mn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Fn(e) {
  return !!Ne && Ne in e;
}
var Bn = we(function(e) {
  e = Wn(e);
  var t = [];
  return sn.test(e) && t.push(""), e.replace(an, function(r, n, o, s) {
    t.push(o ? s.replace(un, "$1") : n || r);
  }), t;
});
function Kn(e) {
  if (typeof e == "string" || Se(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -st ? "-0" : t;
}
function Gn(e) {
  if (e != null) {
    try {
      return it.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function we(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(Qr);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (we.Cache || P)(), r;
}
we.Cache = P;
function Un(e, t) {
  return e === t || e !== e && t !== t;
}
var lt = Array.isArray;
function qn(e) {
  var t = ft(e) ? ct.call(e) : "";
  return t == en || t == tn;
}
function ft(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function zn(e) {
  return !!e && typeof e == "object";
}
function Se(e) {
  return typeof e == "symbol" || zn(e) && ct.call(e) == rn;
}
function Wn(e) {
  return e == null ? "" : Vn(e);
}
function Yn(e, t, r) {
  var n = e == null ? void 0 : In(e, t);
  return n === void 0 ? r : n;
}
var Jn = Yn;
const Zn = /* @__PURE__ */ Ye(Jn), Ee = Symbol("FormContext");
function Xn(e = {}) {
  const t = g(e), r = g({}), n = g({}), o = g(!1);
  function s(c) {
    Pe(n.value, c, !0);
  }
  function a(c, l) {
    return Zn(t.value, c, l);
  }
  function i(c, l) {
    Pe(t.value, c, l);
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
function Rs(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function Ps(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const Qn = x({
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
    const n = g(), o = Xn(e.data), s = he(), { data: a, processing: i, errors: c, touched: l } = o;
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
    function d(h) {
      h.preventDefault(), h.stopPropagation(), i.value = !0, c.value = {}, l.value = {}, Y(() => f().catch((b) => {
        b instanceof B && (c.value = b.errors);
      }).finally(() => {
        i.value = !1;
      }));
    }
    return Mt(() => e.data, (h) => {
      a.value = h;
    }), r({
      ctx: o,
      submit: u
    }), _(Ee, o), () => C("form", {
      ref: (h) => n.value = h,
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
}), dt = Symbol("ViewResolver"), ve = Symbol("StackedView"), Ce = Symbol("StackedViewDepth"), ht = Symbol("StackedViewParent"), pt = Symbol("StackedViewLocation"), _t = Symbol("StackedViewQuery");
function eo(e) {
  return Array.isArray(e) ? e : [e];
}
function to() {
  const e = m(dt);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function ro() {
  const e = m(ve);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function no() {
  const e = m(Ce);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const gt = x({
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
    const t = to(), r = no(), n = ro(), o = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.location;
    }), s = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.query;
    }), a = S(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return _(ve, a), _(Ce, S(() => r.value + 1)), _(ht, S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.parent;
    })), _(pt, o), _(_t, s), () => {
      if (n.value && "component" in n.value) {
        let i = t(n.value.component);
        i.inheritAttrs = !!i.inheritAttrs;
        let c = C(i, n.value.props);
        return e.allowLayouts && i.layout && (c = eo(i.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, C(u, null, () => l)))), c;
      }
    };
  }
}), oo = x({
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
    const n = Yt(), o = he(), s = g(!1), a = S(() => {
      var b;
      let u = n.value.replace(/\/$/, ""), f = (b = e.href) == null ? void 0 : b.replace(/\/$/, ""), d = u === f, h = !e.explicit && f && n.value.startsWith(f);
      return d || h;
    }), i = S(() => e.href ? "a" : "button"), c = S(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !so(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: f, href: d, data: h, preserveScroll: b, replace: Vt } = e;
      s.value = !0, Y(() => {
        o.dispatch(f, d, { data: h, preserveScroll: b, replace: Vt }).then(() => {
          s.value = !1;
        }).catch(() => {
          s.value = !1;
        });
      });
    }
    return () => C(
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
function so(e, t, r) {
  return r === "_blank" || ao(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function ao(e) {
  try {
    let t = window.location.host, r = new URL(e).host;
    return t !== r;
  } catch {
    return !1;
  }
}
const yt = Symbol("ToastRegistry");
function mt() {
  let e = m(yt);
  if (!e)
    throw new Error("Toasts are used out of router context!");
  return e;
}
const io = x({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = mt();
    return () => C("div", r, t.default({ toasts: n.value }));
  }
}), co = x({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = mt(), o = g();
    function s() {
      clearTimeout(o.value), n.value = n.value.filter((a) => a.id !== e.toast.id);
    }
    return le(() => {
      o.value = setTimeout(() => s(), e.toast.duration * 1e3);
    }), fe(() => {
      clearTimeout(o.value);
    }), () => C("li", r, t.default({ toast: e.toast, close: s }));
  }
}), uo = x({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = he(), o = g(), s = g(!1);
    function a(l) {
      o.value = l, s.value = !0;
    }
    async function i(l) {
      let { method: u, url: f, options: d } = o.value;
      return await n.post(e.action, l).then(async () => await n.dispatch(u, f, d).then(async (h) => (c(), await Y(() => h))));
    }
    function c() {
      s.value = !1, o.value = void 0;
    }
    return le(() => {
      ie.addEventListener("password.confirm", a);
    }), fe(() => {
      ie.removeEventListener("password.confirm", a);
    }), () => C("div", r, t.default({ open: s.value, submit: i, cancel: c }));
  }
});
function lo(e, t) {
  return St(wt(e), t);
}
function fo(e, t, r) {
  return St(ho(wt(e), t), r);
}
function wt(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function ho(e, t) {
  let r = e.split("|"), n = po(r, t);
  if (n)
    return n.trim();
  r = go(r);
  let o = yo(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function po(e, t) {
  for (let r in e) {
    let n = _o(r, t);
    if (n)
      return n;
  }
}
function _o(e, t) {
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
function go(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function St(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function yo(e) {
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
function Et(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && mo(o.searchParams, t), r && (o.hash = r), o.toString();
}
function mo(e, t) {
  Object.keys(t).forEach((r) => {
    ce(e, r, $(t[r]));
  });
}
function ce(e, t, r, n) {
  return n && (t = n + "[" + t + "]"), r == null ? (e.append(t, ""), e) : Array.isArray(r) ? (r.forEach((o, s) => {
    ce(e, s.toString(), o, t);
  }), e) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    ce(e, o, r[o], t);
  }), e) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), e.append(t, r), e);
}
function wo(e, t = {}, r) {
  return Eo(So(e), t, r);
}
function So(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Eo(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = vo(n, t), s = Object.keys(t).reduce((a, i) => (n.params.includes(i) || (a[i] = $(t[i])), a), {});
  return Et(o, s, r, n.domain);
}
function vo(e, t) {
  return e.params.reduce((r, n) => {
    let o = e.binding[n] || "id", s = $(t[n]);
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
function te(e, t) {
  const r = new Set(e.split(","));
  return (n) => r.has(n);
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const G = () => {
}, Co = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), bo = Object.assign, be = Array.isArray, L = (e) => typeof e == "function", y = (e) => typeof e == "string", $e = (e) => e !== null && typeof e == "object", U = (e) => ($e(e) || L(e)) && L(e.then) && L(e.catch), $o = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, To = /\B([A-Z])/g, Oo = $o(
  (e) => e.replace(To, "-$1").toLowerCase()
);
let je;
const Ao = () => je || (je = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function vt(e) {
  if (be(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = y(n) ? No(n) : vt(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (y(e) || $e(e))
    return e;
}
const xo = /;(?![^(]*\))/g, Ro = /:([^]+)/, Po = /\/\*[^]*?\*\//g;
function No(e) {
  const t = {};
  return e.replace(Po, "").split(xo).forEach((r) => {
    if (r) {
      const n = r.split(Ro);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Lo(e) {
  let t = "";
  if (!e || y(e))
    return t;
  for (const r in e) {
    const n = e[r];
    if (y(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : Oo(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function Ct(e) {
  let t = "";
  if (y(e))
    t = e;
  else if (be(e))
    for (let r = 0; r < e.length; r++) {
      const n = Ct(e[r]);
      n && (t += n + " ");
    }
  else if ($e(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const ko = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Io = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", jo = /* @__PURE__ */ te(ko), Vo = /* @__PURE__ */ te(Io), Do = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ho = /* @__PURE__ */ te(
  Do + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function Mo(e) {
  return !!e || e === "";
}
const Fo = /[>/="'\u0009\u000a\u000c\u0020]/, oe = {};
function Bo(e) {
  if (oe.hasOwnProperty(e))
    return oe[e];
  const t = Fo.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), oe[e] = !t;
}
const Ko = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function Go(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const Uo = /["'&<>]/;
function v(e) {
  const t = "" + e, r = Uo.exec(t);
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
const qo = /^-?>|<!--|-->|--!>|<!-$/g;
function zo(e) {
  return e.replace(qo, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const Wo = /* @__PURE__ */ te(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function Yo(e, t) {
  let r = "";
  for (const n in e) {
    if (Wo(n) || Co(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${Zo(o)}"` : n === "style" ? r += ` style="${Xo(o)}"` : r += Jo(n, o, t);
  }
  return r;
}
function Jo(e, t, r) {
  if (!Go(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || jo(r)) ? e : Ko[e] || e.toLowerCase();
  return Ho(n) ? Mo(t) ? ` ${n}` : "" : Bo(n) ? t === "" ? ` ${n}` : ` ${n}="${v(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function Zo(e) {
  return v(Ct(e));
}
function Xo(e) {
  if (!e)
    return "";
  if (y(e))
    return v(e);
  const t = vt(e);
  return v(Lo(t));
}
function Qo(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[Ke], a = s.__teleportBuffers || (s.__teleportBuffers = {}), i = a[r] || (a[r] = []), c = i.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = Nt();
    f("<!--teleport start anchor-->"), t(f), f("<!--teleport anchor-->"), l = u();
  }
  i.splice(c, 0, l), e("<!--teleport end-->");
}
let Ve, q = !0;
const bt = [];
function $t() {
  bt.push(q), q = !1;
}
function Tt() {
  const e = bt.pop();
  q = e === void 0 ? !0 : e;
}
function es(e, t, r) {
  var n;
  t.get(e) !== e._trackId && (t.set(e, e._trackId), e.deps[e._depsLength] !== t ? e.deps[e._depsLength++] = t : e._depsLength++, process.env.NODE_ENV !== "production" && ((n = e.onTrack) == null || n.call(e, bo({ effect: e }, r))));
}
const ts = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, De = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function He(e, t, r) {
  if (q && Ve) {
    let n = De.get(e);
    n || De.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = ts(() => n.delete(r))), es(
      Ve,
      o,
      process.env.NODE_ENV !== "production" ? {
        target: e,
        type: t,
        key: r
      } : void 0
    );
  }
}
function ue(e) {
  const t = e && e.__v_raw;
  return t ? ue(t) : e;
}
function rs(e) {
  return !!(e && e.__v_isRef === !0);
}
const T = [];
function ns(e) {
  T.push(e);
}
function os() {
  T.pop();
}
let se = !1;
function z(e, ...t) {
  if (se) return;
  se = !0, $t();
  const r = T.length ? T[T.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = ss();
  if (n)
    xt(
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
          ({ vnode: s }) => `at <${Pt(r, s.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const s = [`[Vue warn]: ${e}`, ...t];
    o.length && s.push(`
`, ...as(o)), console.warn(...s);
  }
  Tt(), se = !1;
}
function ss() {
  let e = T[T.length - 1];
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
function as(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ...is(r));
  }), t;
}
function is({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${Pt(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...cs(e.props), s] : [o + s];
}
function cs(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...Ot(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function Ot(e, t, r) {
  return y(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : rs(t) ? (t = Ot(e, ue(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : L(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = ue(t), r ? t : [`${e}=`, t]);
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
function xt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    us(o, t, r);
  }
}
function us(e, t, r, n = !0) {
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
      $t(), xt(
        c,
        null,
        10,
        [e, a, i]
      ), Tt();
      return;
    }
  }
  ls(e, r, o, n);
}
function ls(e, t, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = At[t];
    if (r && ns(r), z(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && os(), n)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let N, H = [];
function Rt(e, t) {
  var r, n;
  N = e, N ? (N.enabled = !0, H.forEach(({ event: o, args: s }) => N.emit(o, ...s)), H = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    Rt(s, t);
  }), setTimeout(() => {
    N || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, H = []);
  }, 3e3)) : H = [];
}
{
  const e = Ao(), t = (r, n) => {
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
const fs = /(?:^|[-_])(\w)/g, ds = (e) => e.replace(fs, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function hs(e, t = !0) {
  return L(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Pt(e, t, r = !1) {
  let n = hs(t);
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
  return n ? ds(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function ps(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: _s,
  setCurrentRenderingInstance: Me,
  setupComponent: gs,
  renderComponentRoot: Fe,
  normalizeVNode: ys
} = Ge;
function Nt() {
  let e = !1;
  const t = [];
  return {
    getBuffer() {
      return t;
    },
    push(r) {
      const n = y(r);
      if (e && n) {
        t[t.length - 1] += r;
        return;
      }
      t.push(r), e = n, (U(r) || be(r) && r.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function Lt(e, t = null, r) {
  const n = _s(e, t, null), o = gs(
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
    ).catch(G)), i.then(() => Be(n, r));
  } else
    return Be(n, r);
}
function Be(e, t) {
  const r = e.type, { getBuffer: n, push: o } = Nt();
  if (L(r)) {
    let s = Fe(e);
    if (!r.props)
      for (const a in e.attrs)
        a.startsWith("data-v-") && ((s.props || (s.props = {}))[a] = "");
    W(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === G) && !e.ssrRender && !r.ssrRender && y(r.template) && (r.ssrRender = ps(r.template));
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
      const l = Me(e);
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
        Me(l);
      }
    } else if (e.render && e.render !== G)
      W(
        o,
        e.subTree = Fe(e),
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
    case zt:
      e(v(a));
      break;
    case qt:
      e(
        a ? `<!--${zo(a)}-->` : "<!---->"
      );
      break;
    case Ut:
      e(a);
      break;
    case Gt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), Te(
        e,
        a,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? ms(e, t, r, n) : s & 6 ? e(Lt(t, r, n)) : s & 64 ? Ss(e, t, r, n) : s & 128 ? W(e, t.ssContent, r, n) : F(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function Te(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    W(e, ys(t[o]), r, n);
}
function ms(e, t, r, n) {
  const o = t.type;
  let { props: s, children: a, shapeFlag: i, scopeId: c, dirs: l } = t, u = `<${o}`;
  l && (s = ws(t, s, l)), s && (u += Yo(s, o)), c && (u += ` ${c}`);
  let f = r, d = t;
  for (; f && d === f.subTree; )
    d = f.vnode, d.scopeId && (u += ` ${d.scopeId}`), f = f.parent;
  if (n && (u += ` ${n}`), e(u + ">"), !Vo(o)) {
    let h = !1;
    s && (s.innerHTML ? (h = !0, e(s.innerHTML)) : s.textContent ? (h = !0, e(v(s.textContent))) : o === "textarea" && s.value && (h = !0, e(v(s.value)))), h || (i & 8 ? e(v(a)) : i & 16 && Te(
      e,
      a,
      r,
      n
    )), e(`</${o}>`);
  }
}
function ws(e, t, r) {
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
  return Wt(t || {}, ...n);
}
function Ss(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || F("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!y(o))
    return F(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  Qo(
    e,
    (a) => {
      Te(
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
const { isVNode: Es } = Ge;
function M(e, t, r) {
  if (!e.hasAsync)
    return t + It(e);
  let n = t;
  for (let o = r; o < e.length; o += 1) {
    const s = e[o];
    if (y(s)) {
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
function It(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    y(n) ? t += n : t += It(n);
  }
  return t;
}
async function jt(e, t = {}) {
  if (Es(e))
    return jt(Bt({ render: () => e }), t);
  const r = Kt(e._component, e._props);
  r.appContext = e._context, e.provide(Ke, t);
  const n = await Lt(r), o = await kt(n);
  if (await vs(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function vs(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await kt(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
Ft();
const Cs = x({
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
    const t = g(e.state.location), r = g(e.state.stack), n = g(e.state.signature), o = g(e.state.toasts);
    function s() {
      return {
        location: $(D(t)),
        signature: $(D(n)),
        stack: $(D(r))
      };
    }
    async function a(c) {
      return t.value = c.location, n.value = c.signature, c.stack && (r.value = We($(D(r.value)), c.stack)), c.toasts && c.toasts.length > 0 && (o.value = [...o.value, ...c.toasts]), await Y(() => s());
    }
    _(Ue, t), _(qe, n), _(ze, a), _(dt, e.resolver), _(Ce, S(() => 0)), _(ve, r), _(yt, o);
    function i(c) {
      c.state ? (t.value = c.state.location, r.value = c.state.stack, n.value = c.state.signature) : (window.history.replaceState(s(), "", t.value), window.scroll(0, 0));
    }
    return le(() => {
      window.history.replaceState(s(), "", t.value), window.addEventListener("popstate", i);
    }), fe(() => {
      window.removeEventListener("popstate", i);
    }), () => C(gt, { allowLayouts: !0 });
  }
});
async function Ns({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || bs(), s = r({ router: Cs, props: { resolver: t, state: o } });
  return n ? await jt(s) : "";
}
function bs() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
function Ls() {
  return m(Ee, null);
}
function ks() {
  let e = m(Ee);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function Is() {
  const e = m(pt);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function $s() {
  const e = m(ht);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function js() {
  const e = $s();
  return S(() => {
    if (e && e.value && e.value.location)
      return Et(e.value.location, e.value.query);
  });
}
function Vs() {
  const e = m(_t);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function Ts(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function Ds(e) {
  return !Ts(e);
}
function Hs(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
var Os = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Os || {});
function Ms() {
  return {
    install(e) {
      e.component("RouterView", gt), e.component("RouterLink", oo), e.component("FormController", Qn), e.component("ToastController", io), e.component("PasswordConfirmationController", uo), e.component("Toast", co), e.config.globalProperties.$t = lo, e.config.globalProperties.$tc = fo, e.config.globalProperties.$route = wo;
    }
  };
}
export {
  B as CompleteResponse,
  Xt as ErrorModal,
  ie as EventBus,
  Ee as FormContextInjectionKey,
  Qn as FormControllerComponent,
  de as Request,
  ae as Response,
  Cs as RouterComponent,
  oo as RouterLinkComponent,
  gt as RouterViewComponent,
  Ce as StackedViewDepthInjectionKey,
  ve as StackedViewInjectionKey,
  pt as StackedViewLocationInjectionKey,
  ht as StackedViewParentInjectionKey,
  _t as StackedViewQueryInjectionKey,
  dt as StackedViewResolverInjectionKey,
  Ue as StateLocationInjectionKey,
  ze as StateManagerInjectionKey,
  qe as StateStackSignatureInjectionKey,
  co as ToastComponent,
  io as ToastControllerComponent,
  Os as ToastKind,
  yt as ToastRegistryInjectionKey,
  Ts as blank,
  Xn as createFormContext,
  Ns as createFoundationController,
  Ms as createOtherSoftwareFoundation,
  Ds as filled,
  Ps as getModelFromContext,
  Hs as hash,
  wo as route,
  Rs as setModelWithContext,
  lo as trans,
  fo as transChoice,
  We as updateStack,
  Et as url,
  Ls as useFromContext,
  he as useHttpClient,
  Yt as useLocation,
  ks as usePersistentFormContext,
  Jt as useStackSignature,
  Zt as useStateManager,
  mt as useToasts,
  no as useViewDepth,
  Is as useViewLocation,
  $s as useViewParent,
  js as useViewParentLocation,
  Vs as useViewQuery,
  to as useViewResolver,
  ro as useViewStack,
  eo as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

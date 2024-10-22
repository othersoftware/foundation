var Mt = Object.defineProperty;
var Ft = (e, t, r) => t in e ? Mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var p = (e, t, r) => Ft(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as m, ref as _, defineComponent as P, watch as Bt, provide as g, h as b, nextTick as v, computed as S, onMounted as fe, onBeforeUnmount as de, toRaw as T, initDirectivesForSSR as Kt, createApp as Gt, createVNode as Ut, ssrContextKey as Ue, warn as K, Fragment as qt, Static as zt, Comment as Wt, Text as Yt, mergeProps as Jt, ssrUtils as qe, toValue as M } from "vue";
class ie {
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
class G extends ie {
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
const ze = Symbol("StateLocation"), We = Symbol("StateStackSignature"), Ye = Symbol("StateManager");
function Zt() {
  let e = m(ze);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function Xt() {
  let e = m(We);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function Qt() {
  let e = m(Ye);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function Je(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Je(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class he {
  constructor(t, r, n = void 0, o = void 0) {
    p(this, "method");
    p(this, "url");
    p(this, "xhr");
    p(this, "body");
    p(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = r, this.body = n, this.signature = o;
  }
  static send(t, r, n = void 0, o = void 0) {
    return new he(t, r, n, o).send();
  }
  send() {
    return new Promise((t, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? r(new G(this.xhr)) : r(new ie(this.xhr)) : t(new G(this.xhr)));
      }, this.xhr.onerror = () => {
        r(new ie(this.xhr));
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
const er = {
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
}, w = {}, ce = {
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
function pe() {
  const e = Qt(), t = Xt();
  async function r(i, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return await he.send(i, c, l, t.value).then(async (d) => await e.update(d).then((h) => d.redirect ? a(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || s(), f ? o(h) : n(h), Promise.resolve(d)))).catch(async (d) => d instanceof G ? await e.update(d).then(() => Promise.reject(d)) : d.status === 423 ? (ce.dispatch("password.confirm", { method: i, url: c, options: { data: l, preserveScroll: u, replace: f } }), Promise.reject(d)) : (console.error(d), APP_DEBUG && d.content && er.show(d.content), Promise.reject(d)));
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
function Ze(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var tr = "Expected a function", Xe = "__lodash_hash_undefined__", Qe = 1 / 0, rr = 9007199254740991, nr = "[object Function]", or = "[object GeneratorFunction]", sr = "[object Symbol]", ar = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, ir = /^\w*$/, cr = /^\./, ur = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, lr = /[\\^$.*+?()[\]{}|]/g, fr = /\\(\\)?/g, dr = /^\[object .+?Constructor\]$/, hr = /^(?:0|[1-9]\d*)$/, pr = typeof E == "object" && E && E.Object === Object && E, _r = typeof self == "object" && self && self.Object === Object && self, _e = pr || _r || Function("return this")();
function gr(e, t) {
  return e == null ? void 0 : e[t];
}
function yr(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var mr = Array.prototype, wr = Function.prototype, et = Object.prototype, ne = _e["__core-js_shared__"], Oe = function() {
  var e = /[^.]+$/.exec(ne && ne.keys && ne.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), tt = wr.toString, Z = et.hasOwnProperty, rt = et.toString, Sr = RegExp(
  "^" + tt.call(Z).replace(lr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), xe = _e.Symbol, vr = mr.splice, Er = nt(_e, "Map"), D = nt(Object, "create"), Pe = xe ? xe.prototype : void 0, Re = Pe ? Pe.toString : void 0;
function O(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Cr() {
  this.__data__ = D ? D(null) : {};
}
function br(e) {
  return this.has(e) && delete this.__data__[e];
}
function $r(e) {
  var t = this.__data__;
  if (D) {
    var r = t[e];
    return r === Xe ? void 0 : r;
  }
  return Z.call(t, e) ? t[e] : void 0;
}
function Tr(e) {
  var t = this.__data__;
  return D ? t[e] !== void 0 : Z.call(t, e);
}
function Ar(e, t) {
  var r = this.__data__;
  return r[e] = D && t === void 0 ? Xe : t, this;
}
O.prototype.clear = Cr;
O.prototype.delete = br;
O.prototype.get = $r;
O.prototype.has = Tr;
O.prototype.set = Ar;
function j(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Or() {
  this.__data__ = [];
}
function xr(e) {
  var t = this.__data__, r = X(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : vr.call(t, r, 1), !0;
}
function Pr(e) {
  var t = this.__data__, r = X(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Rr(e) {
  return X(this.__data__, e) > -1;
}
function Nr(e, t) {
  var r = this.__data__, n = X(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
j.prototype.clear = Or;
j.prototype.delete = xr;
j.prototype.get = Pr;
j.prototype.has = Rr;
j.prototype.set = Nr;
function R(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Lr() {
  this.__data__ = {
    hash: new O(),
    map: new (Er || j)(),
    string: new O()
  };
}
function kr(e) {
  return Q(this, e).delete(e);
}
function Ir(e) {
  return Q(this, e).get(e);
}
function jr(e) {
  return Q(this, e).has(e);
}
function Vr(e, t) {
  return Q(this, e).set(e, t), this;
}
R.prototype.clear = Lr;
R.prototype.delete = kr;
R.prototype.get = Ir;
R.prototype.has = jr;
R.prototype.set = Vr;
function Dr(e, t, r) {
  var n = e[t];
  (!(Z.call(e, t) && ot(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function X(e, t) {
  for (var r = e.length; r--; )
    if (ot(e[r][0], t))
      return r;
  return -1;
}
function Hr(e) {
  if (!U(e) || qr(e))
    return !1;
  var t = Jr(e) || yr(e) ? Sr : dr;
  return t.test(Yr(e));
}
function Mr(e, t, r, n) {
  if (!U(e))
    return e;
  t = Gr(t, e) ? [t] : Br(t);
  for (var o = -1, s = t.length, a = s - 1, i = e; i != null && ++o < s; ) {
    var c = Wr(t[o]), l = r;
    if (o != a) {
      var u = i[c];
      l = void 0, l === void 0 && (l = U(u) ? u : Kr(t[o + 1]) ? [] : {});
    }
    Dr(i, c, l), i = i[c];
  }
  return e;
}
function Fr(e) {
  if (typeof e == "string")
    return e;
  if (ye(e))
    return Re ? Re.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Qe ? "-0" : t;
}
function Br(e) {
  return st(e) ? e : zr(e);
}
function Q(e, t) {
  var r = e.__data__;
  return Ur(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function nt(e, t) {
  var r = gr(e, t);
  return Hr(r) ? r : void 0;
}
function Kr(e, t) {
  return t = t ?? rr, !!t && (typeof e == "number" || hr.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function Gr(e, t) {
  if (st(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ye(e) ? !0 : ir.test(e) || !ar.test(e) || t != null && e in Object(t);
}
function Ur(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function qr(e) {
  return !!Oe && Oe in e;
}
var zr = ge(function(e) {
  e = Xr(e);
  var t = [];
  return cr.test(e) && t.push(""), e.replace(ur, function(r, n, o, s) {
    t.push(o ? s.replace(fr, "$1") : n || r);
  }), t;
});
function Wr(e) {
  if (typeof e == "string" || ye(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -Qe ? "-0" : t;
}
function Yr(e) {
  if (e != null) {
    try {
      return tt.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function ge(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(tr);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (ge.Cache || R)(), r;
}
ge.Cache = R;
function ot(e, t) {
  return e === t || e !== e && t !== t;
}
var st = Array.isArray;
function Jr(e) {
  var t = U(e) ? rt.call(e) : "";
  return t == nr || t == or;
}
function U(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Zr(e) {
  return !!e && typeof e == "object";
}
function ye(e) {
  return typeof e == "symbol" || Zr(e) && rt.call(e) == sr;
}
function Xr(e) {
  return e == null ? "" : Fr(e);
}
function Qr(e, t, r) {
  return e == null ? e : Mr(e, t, r);
}
var en = Qr;
const Ne = /* @__PURE__ */ Ze(en);
var tn = "Expected a function", at = "__lodash_hash_undefined__", it = 1 / 0, rn = "[object Function]", nn = "[object GeneratorFunction]", on = "[object Symbol]", sn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, an = /^\w*$/, cn = /^\./, un = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ln = /[\\^$.*+?()[\]{}|]/g, fn = /\\(\\)?/g, dn = /^\[object .+?Constructor\]$/, hn = typeof E == "object" && E && E.Object === Object && E, pn = typeof self == "object" && self && self.Object === Object && self, me = hn || pn || Function("return this")();
function _n(e, t) {
  return e == null ? void 0 : e[t];
}
function gn(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var yn = Array.prototype, mn = Function.prototype, ct = Object.prototype, oe = me["__core-js_shared__"], Le = function() {
  var e = /[^.]+$/.exec(oe && oe.keys && oe.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), ut = mn.toString, we = ct.hasOwnProperty, lt = ct.toString, wn = RegExp(
  "^" + ut.call(we).replace(ln, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), ke = me.Symbol, Sn = yn.splice, vn = ft(me, "Map"), H = ft(Object, "create"), Ie = ke ? ke.prototype : void 0, je = Ie ? Ie.toString : void 0;
function x(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function En() {
  this.__data__ = H ? H(null) : {};
}
function Cn(e) {
  return this.has(e) && delete this.__data__[e];
}
function bn(e) {
  var t = this.__data__;
  if (H) {
    var r = t[e];
    return r === at ? void 0 : r;
  }
  return we.call(t, e) ? t[e] : void 0;
}
function $n(e) {
  var t = this.__data__;
  return H ? t[e] !== void 0 : we.call(t, e);
}
function Tn(e, t) {
  var r = this.__data__;
  return r[e] = H && t === void 0 ? at : t, this;
}
x.prototype.clear = En;
x.prototype.delete = Cn;
x.prototype.get = bn;
x.prototype.has = $n;
x.prototype.set = Tn;
function V(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function An() {
  this.__data__ = [];
}
function On(e) {
  var t = this.__data__, r = ee(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : Sn.call(t, r, 1), !0;
}
function xn(e) {
  var t = this.__data__, r = ee(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Pn(e) {
  return ee(this.__data__, e) > -1;
}
function Rn(e, t) {
  var r = this.__data__, n = ee(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
V.prototype.clear = An;
V.prototype.delete = On;
V.prototype.get = xn;
V.prototype.has = Pn;
V.prototype.set = Rn;
function N(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Nn() {
  this.__data__ = {
    hash: new x(),
    map: new (vn || V)(),
    string: new x()
  };
}
function Ln(e) {
  return te(this, e).delete(e);
}
function kn(e) {
  return te(this, e).get(e);
}
function In(e) {
  return te(this, e).has(e);
}
function jn(e, t) {
  return te(this, e).set(e, t), this;
}
N.prototype.clear = Nn;
N.prototype.delete = Ln;
N.prototype.get = kn;
N.prototype.has = In;
N.prototype.set = jn;
function ee(e, t) {
  for (var r = e.length; r--; )
    if (zn(e[r][0], t))
      return r;
  return -1;
}
function Vn(e, t) {
  t = Fn(t, e) ? [t] : Mn(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Un(t[r++])];
  return r && r == n ? e : void 0;
}
function Dn(e) {
  if (!ht(e) || Kn(e))
    return !1;
  var t = Wn(e) || gn(e) ? wn : dn;
  return t.test(qn(e));
}
function Hn(e) {
  if (typeof e == "string")
    return e;
  if (ve(e))
    return je ? je.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -it ? "-0" : t;
}
function Mn(e) {
  return dt(e) ? e : Gn(e);
}
function te(e, t) {
  var r = e.__data__;
  return Bn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function ft(e, t) {
  var r = _n(e, t);
  return Dn(r) ? r : void 0;
}
function Fn(e, t) {
  if (dt(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ve(e) ? !0 : an.test(e) || !sn.test(e) || t != null && e in Object(t);
}
function Bn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Kn(e) {
  return !!Le && Le in e;
}
var Gn = Se(function(e) {
  e = Jn(e);
  var t = [];
  return cn.test(e) && t.push(""), e.replace(un, function(r, n, o, s) {
    t.push(o ? s.replace(fn, "$1") : n || r);
  }), t;
});
function Un(e) {
  if (typeof e == "string" || ve(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -it ? "-0" : t;
}
function qn(e) {
  if (e != null) {
    try {
      return ut.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
function Se(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(tn);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (Se.Cache || N)(), r;
}
Se.Cache = N;
function zn(e, t) {
  return e === t || e !== e && t !== t;
}
var dt = Array.isArray;
function Wn(e) {
  var t = ht(e) ? lt.call(e) : "";
  return t == rn || t == nn;
}
function ht(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Yn(e) {
  return !!e && typeof e == "object";
}
function ve(e) {
  return typeof e == "symbol" || Yn(e) && lt.call(e) == on;
}
function Jn(e) {
  return e == null ? "" : Hn(e);
}
function Zn(e, t, r) {
  var n = e == null ? void 0 : Vn(e, t);
  return n === void 0 ? r : n;
}
var Xn = Zn;
const Qn = /* @__PURE__ */ Ze(Xn), Ee = Symbol("FormContext");
function eo(e = {}) {
  const t = _(e), r = _({}), n = _({}), o = _(!1);
  function s(c) {
    Ne(n.value, c, !0);
  }
  function a(c, l) {
    return Qn(t.value, c, l);
  }
  function i(c, l) {
    Ne(t.value, c, l);
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
function Ls(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function ks(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const to = P({
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
    const n = _(), o = eo(e.data), s = pe(), { data: a, processing: i, errors: c, touched: l } = o;
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
      h.preventDefault(), h.stopPropagation(), i.value = !0, c.value = {}, l.value = {}, v(() => f().catch(($) => {
        $ instanceof G && (c.value = $.errors);
      }).finally(() => {
        i.value = !1;
      }));
    }
    return Bt(() => e.data, (h) => {
      a.value = h;
    }), r({
      ctx: o,
      submit: u
    }), g(Ee, o), () => b("form", {
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
}), pt = Symbol("ViewResolver"), Ce = Symbol("StackedView"), be = Symbol("StackedViewDepth"), _t = Symbol("StackedViewParent"), gt = Symbol("StackedViewLocation"), yt = Symbol("StackedViewQuery");
function ro(e) {
  return Array.isArray(e) ? e : [e];
}
function no() {
  const e = m(pt);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function oo() {
  const e = m(Ce);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function so() {
  const e = m(be);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const mt = P({
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
    const t = no(), r = so(), n = oo(), o = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.location;
    }), s = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.query;
    }), a = S(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return g(Ce, a), g(be, S(() => r.value + 1)), g(_t, S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.parent;
    })), g(gt, o), g(yt, s), () => {
      if (n.value && "component" in n.value) {
        let i = t(n.value.component);
        i.inheritAttrs = !!i.inheritAttrs;
        let c = b(i, n.value.props);
        return e.allowLayouts && i.layout && (c = ro(i.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, b(u, null, () => l)))), c;
      }
    };
  }
}), ao = P({
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
    const n = Zt(), o = pe(), s = _(!1), a = S(() => {
      var $;
      let u = n.value.replace(/\/$/, ""), f = ($ = e.href) == null ? void 0 : $.replace(/\/$/, ""), d = u === f, h = !e.explicit && f && n.value.startsWith(f);
      return d || h;
    }), i = S(() => e.href ? "a" : "button"), c = S(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !io(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: f, href: d, data: h, preserveScroll: $, replace: Ht } = e;
      s.value = !0, v(() => {
        o.dispatch(f, d, { data: h, preserveScroll: $, replace: Ht }).then(() => {
          s.value = !1;
        }).catch(() => {
          s.value = !1;
        });
      });
    }
    return () => b(
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
function io(e, t, r) {
  return r === "_blank" || co(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function co(e) {
  try {
    let t = window.location.host, r = new URL(e).host;
    return t !== r;
  } catch {
    return !1;
  }
}
const wt = Symbol("ToastRegistry");
function St() {
  let e = m(wt);
  if (!e)
    throw new Error("Toasts are used out of router context!");
  return e;
}
const uo = P({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = St();
    return () => b("div", r, t.default({ toasts: n.value }));
  }
}), lo = P({
  name: "Toast",
  props: {
    toast: { type: Object, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = St(), o = _();
    function s() {
      clearTimeout(o.value), n.value = n.value.filter((a) => a.id !== e.toast.id);
    }
    return fe(() => {
      o.value = setTimeout(() => s(), e.toast.duration * 1e3);
    }), de(() => {
      clearTimeout(o.value);
    }), () => b("li", r, t.default({ toast: e.toast, close: s }));
  }
}), fo = P({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = pe(), o = _(), s = _(!1);
    function a(l) {
      o.value = l, s.value = !0;
    }
    async function i(l) {
      let { method: u, url: f, options: d } = o.value;
      return await n.post(e.action, l).then(async () => await n.dispatch(u, f, d).then(async (h) => (c(), await v(() => h))));
    }
    function c() {
      s.value = !1, o.value = void 0;
    }
    return fe(() => {
      ce.addEventListener("password.confirm", a);
    }), de(() => {
      ce.removeEventListener("password.confirm", a);
    }), () => b("div", r, t.default({ open: s.value, submit: i, cancel: c }));
  }
});
function ho(e, t) {
  return Et(vt(e), t);
}
function po(e, t, r) {
  return Et(_o(vt(e), t), r);
}
function vt(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function _o(e, t) {
  let r = e.split("|"), n = go(r, t);
  if (n)
    return n.trim();
  r = mo(r);
  let o = wo(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function go(e, t) {
  for (let r in e) {
    let n = yo(r, t);
    if (n)
      return n;
  }
}
function yo(e, t) {
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
function mo(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function Et(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function wo(e) {
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
function Ct(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && So(o.searchParams, t), r && (o.hash = r), o.toString();
}
function So(e, t) {
  Object.keys(t).forEach((r) => {
    ue(e, r, T(t[r]));
  });
}
function ue(e, t, r, n) {
  return n && (t = n + "[" + t + "]"), r == null ? (e.append(t, ""), e) : Array.isArray(r) ? (r.forEach((o, s) => {
    ue(e, s.toString(), o, t);
  }), e) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    ue(e, o, r[o], t);
  }), e) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), e.append(t, r), e);
}
function vo(e, t = {}, r) {
  return Co(Eo(e), t, r);
}
function Eo(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Co(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = bo(n, t), s = Object.keys(t).reduce((a, i) => (n.params.includes(i) || (a[i] = T(t[i])), a), {});
  return Ct(o, s, r, n.domain);
}
function bo(e, t) {
  return e.params.reduce((r, n) => {
    let o = e.binding[n] || "id", s = T(t[n]);
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
function re(e, t) {
  const r = new Set(e.split(","));
  return (n) => r.has(n);
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const q = () => {
}, $o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), To = Object.assign, $e = Array.isArray, I = (e) => typeof e == "function", y = (e) => typeof e == "string", Te = (e) => e !== null && typeof e == "object", z = (e) => (Te(e) || I(e)) && I(e.then) && I(e.catch), Ao = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, Oo = /\B([A-Z])/g, xo = Ao(
  (e) => e.replace(Oo, "-$1").toLowerCase()
);
let Ve;
const Po = () => Ve || (Ve = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function bt(e) {
  if ($e(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = y(n) ? ko(n) : bt(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (y(e) || Te(e))
    return e;
}
const Ro = /;(?![^(]*\))/g, No = /:([^]+)/, Lo = /\/\*[^]*?\*\//g;
function ko(e) {
  const t = {};
  return e.replace(Lo, "").split(Ro).forEach((r) => {
    if (r) {
      const n = r.split(No);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Io(e) {
  let t = "";
  if (!e || y(e))
    return t;
  for (const r in e) {
    const n = e[r];
    if (y(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : xo(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function $t(e) {
  let t = "";
  if (y(e))
    t = e;
  else if ($e(e))
    for (let r = 0; r < e.length; r++) {
      const n = $t(e[r]);
      n && (t += n + " ");
    }
  else if (Te(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const jo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Vo = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Do = /* @__PURE__ */ re(jo), Ho = /* @__PURE__ */ re(Vo), Mo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Fo = /* @__PURE__ */ re(
  Mo + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function Bo(e) {
  return !!e || e === "";
}
const Ko = /[>/="'\u0009\u000a\u000c\u0020]/, se = {};
function Go(e) {
  if (se.hasOwnProperty(e))
    return se[e];
  const t = Ko.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), se[e] = !t;
}
const Uo = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function qo(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const zo = /["'&<>]/;
function C(e) {
  const t = "" + e, r = zo.exec(t);
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
const Wo = /^-?>|<!--|-->|--!>|<!-$/g;
function Yo(e) {
  return e.replace(Wo, "");
}
/**
* @vue/server-renderer v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const Jo = /* @__PURE__ */ re(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function Zo(e, t) {
  let r = "";
  for (const n in e) {
    if (Jo(n) || $o(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${Qo(o)}"` : n === "style" ? r += ` style="${es(o)}"` : r += Xo(n, o, t);
  }
  return r;
}
function Xo(e, t, r) {
  if (!qo(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || Do(r)) ? e : Uo[e] || e.toLowerCase();
  return Fo(n) ? Bo(t) ? ` ${n}` : "" : Go(n) ? t === "" ? ` ${n}` : ` ${n}="${C(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function Qo(e) {
  return C($t(e));
}
function es(e) {
  if (!e)
    return "";
  if (y(e))
    return C(e);
  const t = bt(e);
  return C(Io(t));
}
function ts(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[Ue], a = s.__teleportBuffers || (s.__teleportBuffers = {}), i = a[r] || (a[r] = []), c = i.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = kt();
    f("<!--teleport start anchor-->"), t(f), f("<!--teleport anchor-->"), l = u();
  }
  i.splice(c, 0, l), e("<!--teleport end-->");
}
let De, W = !0;
const Tt = [];
function At() {
  Tt.push(W), W = !1;
}
function Ot() {
  const e = Tt.pop();
  W = e === void 0 ? !0 : e;
}
function rs(e, t, r) {
  var n;
  t.get(e) !== e._trackId && (t.set(e, e._trackId), e.deps[e._depsLength] !== t ? e.deps[e._depsLength++] = t : e._depsLength++, process.env.NODE_ENV !== "production" && ((n = e.onTrack) == null || n.call(e, To({ effect: e }, r))));
}
const ns = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  return r.cleanup = e, r.computed = t, r;
}, He = /* @__PURE__ */ new WeakMap();
Symbol(process.env.NODE_ENV !== "production" ? "iterate" : "");
Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function Me(e, t, r) {
  if (W && De) {
    let n = He.get(e);
    n || He.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || n.set(r, o = ns(() => n.delete(r))), rs(
      De,
      o,
      process.env.NODE_ENV !== "production" ? {
        target: e,
        type: t,
        key: r
      } : void 0
    );
  }
}
function le(e) {
  const t = e && e.__v_raw;
  return t ? le(t) : e;
}
function os(e) {
  return !!(e && e.__v_isRef === !0);
}
const A = [];
function ss(e) {
  A.push(e);
}
function as() {
  A.pop();
}
let ae = !1;
function Y(e, ...t) {
  if (ae) return;
  ae = !0, At();
  const r = A.length ? A[A.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = is();
  if (n)
    Rt(
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
          ({ vnode: s }) => `at <${Lt(r, s.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const s = [`[Vue warn]: ${e}`, ...t];
    o.length && s.push(`
`, ...cs(o)), console.warn(...s);
  }
  Ot(), ae = !1;
}
function is() {
  let e = A[A.length - 1];
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
function cs(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ...us(r));
  }), t;
}
function us({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${Lt(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...ls(e.props), s] : [o + s];
}
function ls(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...xt(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function xt(e, t, r) {
  return y(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : os(t) ? (t = xt(e, le(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : I(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = le(t), r ? t : [`${e}=`, t]);
}
const Pt = {
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
function Rt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    fs(o, t, r);
  }
}
function fs(e, t, r, n = !0) {
  const o = t ? t.vnode : null;
  if (t) {
    let s = t.parent;
    const a = t.proxy, i = process.env.NODE_ENV !== "production" ? Pt[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
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
      At(), Rt(
        c,
        null,
        10,
        [e, a, i]
      ), Ot();
      return;
    }
  }
  ds(e, r, o, n);
}
function ds(e, t, r, n = !0) {
  if (process.env.NODE_ENV !== "production") {
    const o = Pt[t];
    if (r && ss(r), Y(`Unhandled error${o ? ` during execution of ${o}` : ""}`), r && as(), n)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let L, F = [];
function Nt(e, t) {
  var r, n;
  L = e, L ? (L.enabled = !0, F.forEach(({ event: o, args: s }) => L.emit(o, ...s)), F = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    Nt(s, t);
  }), setTimeout(() => {
    L || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, F = []);
  }, 3e3)) : F = [];
}
{
  const e = Po(), t = (r, n) => {
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
const hs = /(?:^|[-_])(\w)/g, ps = (e) => e.replace(hs, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function _s(e, t = !0) {
  return I(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Lt(e, t, r = !1) {
  let n = _s(t);
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
  return n ? ps(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function gs(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: ys,
  setCurrentRenderingInstance: Fe,
  setupComponent: ms,
  renderComponentRoot: Be,
  normalizeVNode: ws
} = qe;
function kt() {
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
      t.push(r), e = n, (z(r) || $e(r) && r.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function It(e, t = null, r) {
  const n = ys(e, t, null), o = ms(
    n,
    !0
    /* isSSR */
  ), s = z(o), a = n.sp;
  if (s || a) {
    let i = s ? o : Promise.resolve();
    return a && (i = i.then(
      () => Promise.all(
        a.map((c) => c.call(n.proxy))
      )
    ).catch(q)), i.then(() => Ke(n, r));
  } else
    return Ke(n, r);
}
function Ke(e, t) {
  const r = e.type, { getBuffer: n, push: o } = kt();
  if (I(r)) {
    let s = Be(e);
    if (!r.props)
      for (const a in e.attrs)
        a.startsWith("data-v-") && ((s.props || (s.props = {}))[a] = "");
    J(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === q) && !e.ssrRender && !r.ssrRender && y(r.template) && (r.ssrRender = gs(r.template));
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
      const l = Fe(e);
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
        Fe(l);
      }
    } else if (e.render && e.render !== q)
      J(
        o,
        e.subTree = Be(e),
        e,
        t
      );
    else {
      const a = r.name || r.__file || "<Anonymous>";
      K(`Component ${a} is missing template or render function.`), o("<!---->");
    }
  }
  return n();
}
function J(e, t, r, n) {
  const { type: o, shapeFlag: s, children: a } = t;
  switch (o) {
    case Yt:
      e(C(a));
      break;
    case Wt:
      e(
        a ? `<!--${Yo(a)}-->` : "<!---->"
      );
      break;
    case zt:
      e(a);
      break;
    case qt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), Ae(
        e,
        a,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? Ss(e, t, r, n) : s & 6 ? e(It(t, r, n)) : s & 64 ? Es(e, t, r, n) : s & 128 ? J(e, t.ssContent, r, n) : K(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function Ae(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    J(e, ws(t[o]), r, n);
}
function Ss(e, t, r, n) {
  const o = t.type;
  let { props: s, children: a, shapeFlag: i, scopeId: c, dirs: l } = t, u = `<${o}`;
  l && (s = vs(t, s, l)), s && (u += Zo(s, o)), c && (u += ` ${c}`);
  let f = r, d = t;
  for (; f && d === f.subTree; )
    d = f.vnode, d.scopeId && (u += ` ${d.scopeId}`), f = f.parent;
  if (n && (u += ` ${n}`), e(u + ">"), !Ho(o)) {
    let h = !1;
    s && (s.innerHTML ? (h = !0, e(s.innerHTML)) : s.textContent ? (h = !0, e(C(s.textContent))) : o === "textarea" && s.value && (h = !0, e(C(s.value)))), h || (i & 8 ? e(C(a)) : i & 16 && Ae(
      e,
      a,
      r,
      n
    )), e(`</${o}>`);
  }
}
function vs(e, t, r) {
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
  return Jt(t || {}, ...n);
}
function Es(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || K("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!y(o))
    return K(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  ts(
    e,
    (a) => {
      Ae(
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
const { isVNode: Cs } = qe;
function B(e, t, r) {
  if (!e.hasAsync)
    return t + Vt(e);
  let n = t;
  for (let o = r; o < e.length; o += 1) {
    const s = e[o];
    if (y(s)) {
      n += s;
      continue;
    }
    if (z(s))
      return s.then((i) => (e[o] = i, B(e, n, o)));
    const a = B(s, n, 0);
    if (z(a))
      return a.then((i) => (e[o] = i, B(e, "", o)));
    n = a;
  }
  return n;
}
function jt(e) {
  return B(e, "", 0);
}
function Vt(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    y(n) ? t += n : t += Vt(n);
  }
  return t;
}
async function Dt(e, t = {}) {
  if (Cs(e))
    return Dt(Gt({ render: () => e }), t);
  const r = Ut(e._component, e._props);
  r.appContext = e._context, e.provide(Ue, t);
  const n = await It(r), o = await jt(n);
  if (await bs(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function bs(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await jt(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
Kt();
const $s = P({
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
    const t = _(e.state.location), r = _(e.state.stack), n = _(e.state.signature), o = _(e.state.toasts);
    function s() {
      return {
        location: T(M(t)),
        signature: T(M(n)),
        stack: T(M(r))
      };
    }
    async function a(c) {
      return t.value = c.location, n.value = c.signature, c.stack && (r.value = Je(T(M(r.value)), c.stack)), c.toasts && c.toasts.length > 0 && (o.value = [...o.value, ...c.toasts]), await v(() => s());
    }
    g(ze, t), g(We, n), g(Ye, a), g(pt, e.resolver), g(be, S(() => 0)), g(Ce, r), g(wt, o);
    function i(c) {
      c.state ? (t.value = c.state.location, r.value = c.state.stack, n.value = c.state.signature) : (window.history.replaceState(s(), "", t.value), window.scroll(0, 0));
    }
    return fe(() => {
      window.history.replaceState(s(), "", t.value), window.addEventListener("popstate", i);
    }), de(() => {
      window.removeEventListener("popstate", i);
    }), () => b(mt, { allowLayouts: !0 });
  }
});
async function Is({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || Ts(), s = r({ router: $s, props: { resolver: t, state: o } });
  return n ? await Dt(s) : "";
}
function Ts() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
const k = _();
async function Ge(e, t) {
  return new Promise((r, n) => {
    function o() {
      k.value.processing = !0, v(() => {
        Promise.resolve(t()).then((a) => {
          k.value = void 0, v(() => r(a));
        }).catch((a) => {
          k.value = void 0, v(() => n(a));
        });
      });
    }
    function s() {
      k.value = void 0, v(() => n());
    }
    k.value = { ...e, processing: !1, confirm: o, cancel: s };
  });
}
async function As(e, t) {
  return t !== void 0 ? Ge(e, t) : Ge({}, e);
}
function js() {
  return k;
}
function Vs() {
  return As;
}
function Ds() {
  return m(Ee, null);
}
function Hs() {
  let e = m(Ee);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function Ms() {
  const e = m(gt);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function Os() {
  const e = m(_t);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function Fs() {
  const e = Os();
  return S(() => {
    if (e && e.value && e.value.location)
      return Ct(e.value.location, e.value.query);
  });
}
function Bs() {
  const e = m(yt);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function xs(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function Ks(e) {
  return !xs(e);
}
function Gs(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
var Ps = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Ps || {});
function Us() {
  return {
    install(e) {
      e.component("RouterView", mt), e.component("RouterLink", ao), e.component("FormController", to), e.component("ToastController", uo), e.component("PasswordConfirmationController", fo), e.component("Toast", lo), e.config.globalProperties.$t = ho, e.config.globalProperties.$tc = po, e.config.globalProperties.$route = vo;
    }
  };
}
export {
  G as CompleteResponse,
  er as ErrorModal,
  ce as EventBus,
  Ee as FormContextInjectionKey,
  to as FormControllerComponent,
  he as Request,
  ie as Response,
  $s as RouterComponent,
  ao as RouterLinkComponent,
  mt as RouterViewComponent,
  be as StackedViewDepthInjectionKey,
  Ce as StackedViewInjectionKey,
  gt as StackedViewLocationInjectionKey,
  _t as StackedViewParentInjectionKey,
  yt as StackedViewQueryInjectionKey,
  pt as StackedViewResolverInjectionKey,
  ze as StateLocationInjectionKey,
  Ye as StateManagerInjectionKey,
  We as StateStackSignatureInjectionKey,
  lo as ToastComponent,
  uo as ToastControllerComponent,
  Ps as ToastKind,
  wt as ToastRegistryInjectionKey,
  xs as blank,
  eo as createFormContext,
  Is as createFoundationController,
  Us as createOtherSoftwareFoundation,
  Ks as filled,
  ks as getModelFromContext,
  Gs as hash,
  vo as route,
  Ls as setModelWithContext,
  ho as trans,
  po as transChoice,
  Je as updateStack,
  Ct as url,
  Vs as useConfirmation,
  js as useCurrentConfirmation,
  Ds as useFromContext,
  pe as useHttpClient,
  Zt as useLocation,
  Hs as usePersistentFormContext,
  Xt as useStackSignature,
  Qt as useStateManager,
  St as useToasts,
  so as useViewDepth,
  Ms as useViewLocation,
  Os as useViewParent,
  Fs as useViewParentLocation,
  Bs as useViewQuery,
  no as useViewResolver,
  oo as useViewStack,
  ro as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

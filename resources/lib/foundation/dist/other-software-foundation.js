var Kt = Object.defineProperty;
var Ut = (e, t, r) => t in e ? Kt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var h = (e, t, r) => Ut(e, typeof t != "symbol" ? t + "" : t, r);
import { inject as m, ref as _, defineComponent as N, watch as Gt, provide as g, h as C, nextTick as v, computed as S, onMounted as de, onBeforeUnmount as he, toRaw as O, initDirectivesForSSR as qt, createApp as zt, createVNode as Wt, ssrContextKey as Ge, warn as K, Fragment as Yt, Static as Jt, Comment as Zt, Text as Xt, mergeProps as Qt, ssrUtils as qe, toValue as M } from "vue";
class ce {
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
class U extends ce {
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
const ze = Symbol("StateLocation"), We = Symbol("StateStackSignature"), Ye = Symbol("StateManager");
function er() {
  let e = m(ze);
  if (!e)
    throw new Error("Location is used out of router context!");
  return e;
}
function tr() {
  let e = m(We);
  if (!e)
    throw new Error("Stack signature is used out of router context!");
  return e;
}
function rr() {
  let e = m(Ye);
  if (!e)
    throw new Error("State manager is used out of router context!");
  return { update: e };
}
function Je(e, t) {
  return "keep" in t ? t.child ? (e.child ? e.child = Je(e.child, t.child) : e.child = t.child, { ...e }) : { ...e } : { ...t };
}
class pe {
  constructor(t, r, n = void 0, o = void 0) {
    h(this, "method");
    h(this, "url");
    h(this, "xhr");
    h(this, "body");
    h(this, "signature");
    this.xhr = new XMLHttpRequest(), this.method = t, this.url = r, this.body = n, this.signature = o;
  }
  static send(t, r, n = void 0, o = void 0) {
    return new pe(t, r, n, o).send();
  }
  send() {
    return new Promise((t, r) => {
      if (this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader("Language", APP_LOCALE), this.xhr.setRequestHeader("X-Stack-Router", "true"), this.xhr.setRequestHeader("X-XSRF-TOKEN", this.readCookie("XSRF-TOKEN")), this.signature)
        this.xhr.setRequestHeader("X-Stack-Signature", this.signature);
      else
        throw new Error("Missing signature!");
      this.xhr.onload = () => {
        this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status && (this.xhr.status < 200 || this.xhr.status >= 300 ? this.xhr.status === 422 ? r(new U(this.xhr)) : r(new ce(this.xhr)) : t(new U(this.xhr)));
      }, this.xhr.onerror = () => {
        r(new ce(this.xhr));
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
const nr = {
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
}, w = {}, ue = {
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
function _e() {
  const e = rr(), t = tr();
  async function r(i, c, { data: l = void 0, preserveScroll: u = !1, replace: f = !1 } = {}) {
    return document.body.classList.add("osf-loading"), await pe.send(i, c, l, t.value).then(async (d) => await e.update(d).then((p) => d.redirect ? a(d.redirect) : d.raw ? Promise.resolve(d.raw) : (u || s(), f ? o(p) : n(p), Promise.resolve(d)))).catch(async (d) => d instanceof U ? await e.update(d).then(() => Promise.reject(d)) : d.status === 423 ? (ue.dispatch("password.confirm", { method: i, url: c, options: { data: l, preserveScroll: u, replace: f } }), Promise.reject(d)) : (console.error(d), APP_DEBUG && d.content && nr.show(d.content), Promise.reject(d))).finally(() => {
      document.body.classList.remove("osf-loading");
    });
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
var or = "Expected a function", Xe = "__lodash_hash_undefined__", Qe = 1 / 0, sr = 9007199254740991, ar = "[object Function]", ir = "[object GeneratorFunction]", cr = "[object Symbol]", ur = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, lr = /^\w*$/, fr = /^\./, dr = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, hr = /[\\^$.*+?()[\]{}|]/g, pr = /\\(\\)?/g, _r = /^\[object .+?Constructor\]$/, gr = /^(?:0|[1-9]\d*)$/, yr = typeof E == "object" && E && E.Object === Object && E, mr = typeof self == "object" && self && self.Object === Object && self, ge = yr || mr || Function("return this")();
function wr(e, t) {
  return e == null ? void 0 : e[t];
}
function Sr(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var vr = Array.prototype, Er = Function.prototype, et = Object.prototype, ne = ge["__core-js_shared__"], Ae = function() {
  var e = /[^.]+$/.exec(ne && ne.keys && ne.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), tt = Er.toString, Z = et.hasOwnProperty, rt = et.toString, br = RegExp(
  "^" + tt.call(Z).replace(hr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ne = ge.Symbol, Cr = vr.splice, $r = nt(ge, "Map"), j = nt(Object, "create"), Pe = Ne ? Ne.prototype : void 0, Re = Pe ? Pe.toString : void 0;
function x(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Or() {
  this.__data__ = j ? j(null) : {};
}
function Tr(e) {
  return this.has(e) && delete this.__data__[e];
}
function xr(e) {
  var t = this.__data__;
  if (j) {
    var r = t[e];
    return r === Xe ? void 0 : r;
  }
  return Z.call(t, e) ? t[e] : void 0;
}
function Ar(e) {
  var t = this.__data__;
  return j ? t[e] !== void 0 : Z.call(t, e);
}
function Nr(e, t) {
  var r = this.__data__;
  return r[e] = j && t === void 0 ? Xe : t, this;
}
x.prototype.clear = Or;
x.prototype.delete = Tr;
x.prototype.get = xr;
x.prototype.has = Ar;
x.prototype.set = Nr;
function V(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Pr() {
  this.__data__ = [];
}
function Rr(e) {
  var t = this.__data__, r = X(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : Cr.call(t, r, 1), !0;
}
function kr(e) {
  var t = this.__data__, r = X(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Lr(e) {
  return X(this.__data__, e) > -1;
}
function Ir(e, t) {
  var r = this.__data__, n = X(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
V.prototype.clear = Pr;
V.prototype.delete = Rr;
V.prototype.get = kr;
V.prototype.has = Lr;
V.prototype.set = Ir;
function P(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Vr() {
  this.__data__ = {
    hash: new x(),
    map: new ($r || V)(),
    string: new x()
  };
}
function Dr(e) {
  return Q(this, e).delete(e);
}
function jr(e) {
  return Q(this, e).get(e);
}
function Hr(e) {
  return Q(this, e).has(e);
}
function Mr(e, t) {
  return Q(this, e).set(e, t), this;
}
P.prototype.clear = Vr;
P.prototype.delete = Dr;
P.prototype.get = jr;
P.prototype.has = Hr;
P.prototype.set = Mr;
function Fr(e, t, r) {
  var n = e[t];
  (!(Z.call(e, t) && ot(n, r)) || r === void 0 && !(t in e)) && (e[t] = r);
}
function X(e, t) {
  for (var r = e.length; r--; )
    if (ot(e[r][0], t))
      return r;
  return -1;
}
function Br(e) {
  if (!G(e) || Yr(e))
    return !1;
  var t = Qr(e) || Sr(e) ? br : _r;
  return t.test(Xr(e));
}
function Kr(e, t, r, n) {
  if (!G(e))
    return e;
  t = zr(t, e) ? [t] : Gr(t);
  for (var o = -1, s = t.length, a = s - 1, i = e; i != null && ++o < s; ) {
    var c = Zr(t[o]), l = r;
    if (o != a) {
      var u = i[c];
      l = void 0, l === void 0 && (l = G(u) ? u : qr(t[o + 1]) ? [] : {});
    }
    Fr(i, c, l), i = i[c];
  }
  return e;
}
function Ur(e) {
  if (typeof e == "string")
    return e;
  if (me(e))
    return Re ? Re.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Qe ? "-0" : t;
}
function Gr(e) {
  return st(e) ? e : Jr(e);
}
function Q(e, t) {
  var r = e.__data__;
  return Wr(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function nt(e, t) {
  var r = wr(e, t);
  return Br(r) ? r : void 0;
}
function qr(e, t) {
  return t = t ?? sr, !!t && (typeof e == "number" || gr.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function zr(e, t) {
  if (st(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || me(e) ? !0 : lr.test(e) || !ur.test(e) || t != null && e in Object(t);
}
function Wr(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Yr(e) {
  return !!Ae && Ae in e;
}
var Jr = ye(function(e) {
  e = tn(e);
  var t = [];
  return fr.test(e) && t.push(""), e.replace(dr, function(r, n, o, s) {
    t.push(o ? s.replace(pr, "$1") : n || r);
  }), t;
});
function Zr(e) {
  if (typeof e == "string" || me(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -Qe ? "-0" : t;
}
function Xr(e) {
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
function ye(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(or);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (ye.Cache || P)(), r;
}
ye.Cache = P;
function ot(e, t) {
  return e === t || e !== e && t !== t;
}
var st = Array.isArray;
function Qr(e) {
  var t = G(e) ? rt.call(e) : "";
  return t == ar || t == ir;
}
function G(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function en(e) {
  return !!e && typeof e == "object";
}
function me(e) {
  return typeof e == "symbol" || en(e) && rt.call(e) == cr;
}
function tn(e) {
  return e == null ? "" : Ur(e);
}
function rn(e, t, r) {
  return e == null ? e : Kr(e, t, r);
}
var nn = rn;
const ke = /* @__PURE__ */ Ze(nn);
var on = "Expected a function", at = "__lodash_hash_undefined__", it = 1 / 0, sn = "[object Function]", an = "[object GeneratorFunction]", cn = "[object Symbol]", un = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, ln = /^\w*$/, fn = /^\./, dn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, hn = /[\\^$.*+?()[\]{}|]/g, pn = /\\(\\)?/g, _n = /^\[object .+?Constructor\]$/, gn = typeof E == "object" && E && E.Object === Object && E, yn = typeof self == "object" && self && self.Object === Object && self, we = gn || yn || Function("return this")();
function mn(e, t) {
  return e == null ? void 0 : e[t];
}
function wn(e) {
  var t = !1;
  if (e != null && typeof e.toString != "function")
    try {
      t = !!(e + "");
    } catch {
    }
  return t;
}
var Sn = Array.prototype, vn = Function.prototype, ct = Object.prototype, oe = we["__core-js_shared__"], Le = function() {
  var e = /[^.]+$/.exec(oe && oe.keys && oe.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}(), ut = vn.toString, Se = ct.hasOwnProperty, lt = ct.toString, En = RegExp(
  "^" + ut.call(Se).replace(hn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
), Ie = we.Symbol, bn = Sn.splice, Cn = ft(we, "Map"), H = ft(Object, "create"), Ve = Ie ? Ie.prototype : void 0, De = Ve ? Ve.toString : void 0;
function A(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function $n() {
  this.__data__ = H ? H(null) : {};
}
function On(e) {
  return this.has(e) && delete this.__data__[e];
}
function Tn(e) {
  var t = this.__data__;
  if (H) {
    var r = t[e];
    return r === at ? void 0 : r;
  }
  return Se.call(t, e) ? t[e] : void 0;
}
function xn(e) {
  var t = this.__data__;
  return H ? t[e] !== void 0 : Se.call(t, e);
}
function An(e, t) {
  var r = this.__data__;
  return r[e] = H && t === void 0 ? at : t, this;
}
A.prototype.clear = $n;
A.prototype.delete = On;
A.prototype.get = Tn;
A.prototype.has = xn;
A.prototype.set = An;
function D(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function Nn() {
  this.__data__ = [];
}
function Pn(e) {
  var t = this.__data__, r = ee(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : bn.call(t, r, 1), !0;
}
function Rn(e) {
  var t = this.__data__, r = ee(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function kn(e) {
  return ee(this.__data__, e) > -1;
}
function Ln(e, t) {
  var r = this.__data__, n = ee(r, e);
  return n < 0 ? r.push([e, t]) : r[n][1] = t, this;
}
D.prototype.clear = Nn;
D.prototype.delete = Pn;
D.prototype.get = Rn;
D.prototype.has = kn;
D.prototype.set = Ln;
function R(e) {
  var t = -1, r = e ? e.length : 0;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function In() {
  this.__data__ = {
    hash: new A(),
    map: new (Cn || D)(),
    string: new A()
  };
}
function Vn(e) {
  return te(this, e).delete(e);
}
function Dn(e) {
  return te(this, e).get(e);
}
function jn(e) {
  return te(this, e).has(e);
}
function Hn(e, t) {
  return te(this, e).set(e, t), this;
}
R.prototype.clear = In;
R.prototype.delete = Vn;
R.prototype.get = Dn;
R.prototype.has = jn;
R.prototype.set = Hn;
function ee(e, t) {
  for (var r = e.length; r--; )
    if (Jn(e[r][0], t))
      return r;
  return -1;
}
function Mn(e, t) {
  t = Un(t, e) ? [t] : Kn(t);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[Wn(t[r++])];
  return r && r == n ? e : void 0;
}
function Fn(e) {
  if (!ht(e) || qn(e))
    return !1;
  var t = Zn(e) || wn(e) ? En : _n;
  return t.test(Yn(e));
}
function Bn(e) {
  if (typeof e == "string")
    return e;
  if (Ee(e))
    return De ? De.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -it ? "-0" : t;
}
function Kn(e) {
  return dt(e) ? e : zn(e);
}
function te(e, t) {
  var r = e.__data__;
  return Gn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function ft(e, t) {
  var r = mn(e, t);
  return Fn(r) ? r : void 0;
}
function Un(e, t) {
  if (dt(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || Ee(e) ? !0 : ln.test(e) || !un.test(e) || t != null && e in Object(t);
}
function Gn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function qn(e) {
  return !!Le && Le in e;
}
var zn = ve(function(e) {
  e = Qn(e);
  var t = [];
  return fn.test(e) && t.push(""), e.replace(dn, function(r, n, o, s) {
    t.push(o ? s.replace(pn, "$1") : n || r);
  }), t;
});
function Wn(e) {
  if (typeof e == "string" || Ee(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -it ? "-0" : t;
}
function Yn(e) {
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
function ve(e, t) {
  if (typeof e != "function" || t && typeof t != "function")
    throw new TypeError(on);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(o))
      return s.get(o);
    var a = e.apply(this, n);
    return r.cache = s.set(o, a), a;
  };
  return r.cache = new (ve.Cache || R)(), r;
}
ve.Cache = R;
function Jn(e, t) {
  return e === t || e !== e && t !== t;
}
var dt = Array.isArray;
function Zn(e) {
  var t = ht(e) ? lt.call(e) : "";
  return t == sn || t == an;
}
function ht(e) {
  var t = typeof e;
  return !!e && (t == "object" || t == "function");
}
function Xn(e) {
  return !!e && typeof e == "object";
}
function Ee(e) {
  return typeof e == "symbol" || Xn(e) && lt.call(e) == cn;
}
function Qn(e) {
  return e == null ? "" : Bn(e);
}
function eo(e, t, r) {
  var n = e == null ? void 0 : Mn(e, t);
  return n === void 0 ? r : n;
}
var to = eo;
const ro = /* @__PURE__ */ Ze(to), be = Symbol("FormContext");
function no(e = {}) {
  const t = _(e), r = _({}), n = _({}), o = _(!1);
  function s(c) {
    ke(n.value, c, !0);
  }
  function a(c, l) {
    return ro(t.value, c, l);
  }
  function i(c, l) {
    ke(t.value, c, l);
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
function Hs(e, t, r) {
  return e && t && (t.touch(e), t.fill(e, r)), r;
}
function Ms(e, t, r) {
  return e && t ? t.value(e, r) : r;
}
const oo = N({
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
    const n = _(), o = no(e.data), s = _e(), { data: a, processing: i, errors: c, touched: l } = o;
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
      p.preventDefault(), p.stopPropagation(), i.value = !0, c.value = {}, l.value = {}, v(() => f().catch(($) => {
        $ instanceof U && (c.value = $.errors);
      }).finally(() => {
        i.value = !1;
      }));
    }
    return Gt(() => e.data, (p) => {
      a.value = p;
    }), r({
      ctx: o,
      submit: u
    }), g(be, o), () => C("form", {
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
}), pt = Symbol("ViewResolver"), Ce = Symbol("StackedView"), $e = Symbol("StackedViewDepth"), _t = Symbol("StackedViewParent"), gt = Symbol("StackedViewLocation"), yt = Symbol("StackedViewQuery");
function so(e) {
  return Array.isArray(e) ? e : [e];
}
function ao() {
  const e = m(pt);
  if (!e)
    throw new Error("You're trying to get ViewResolver ouf of Router context!");
  return e;
}
function io() {
  const e = m(Ce);
  if (!e)
    throw new Error("You're trying to get stacked view out of Router context!");
  return e;
}
function co() {
  const e = m($e);
  if (!e)
    throw new Error("You're trying to get view depth out of Router context!");
  return e;
}
const mt = N({
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
    const t = ao(), r = co(), n = io(), o = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.location;
    }), s = S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.query;
    }), a = S(() => {
      if (n.value && n.value.child)
        return { ...n.value.child, parent: n.value };
    });
    return g(Ce, a), g($e, S(() => r.value + 1)), g(_t, S(() => {
      var i;
      return (i = n.value) == null ? void 0 : i.parent;
    })), g(gt, o), g(yt, s), () => {
      if (n.value && "component" in n.value) {
        let i = t(n.value.component);
        i.inheritAttrs = !!i.inheritAttrs;
        let c = C(i, n.value.props);
        return e.allowLayouts && i.layout && (c = so(i.layout).concat(c).reverse().reduce((l, u) => (u = typeof u == "string" ? t(u) : u, u.inheritAttrs = !!u.inheritAttrs, C(u, null, () => l)))), c;
      }
    };
  }
}), uo = N({
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
    const n = er(), o = _e(), s = _(!1), a = S(() => {
      var $;
      let u = n.value.replace(/\/$/, ""), f = ($ = e.href) == null ? void 0 : $.replace(/\/$/, ""), d = u === f, p = !e.explicit && f && n.value.startsWith(f);
      return d || p;
    }), i = S(() => e.href ? "a" : "button"), c = S(() => e.href ? { target: e.target } : { disabled: e.disabled });
    function l(u) {
      if (!e.href || !lo(u, e.href, e.target) || (u.preventDefault(), e.disabled))
        return;
      let { method: f, href: d, data: p, preserveScroll: $, replace: Bt } = e;
      s.value = !0, v(() => {
        o.dispatch(f, d, { data: p, preserveScroll: $, replace: Bt }).then(() => {
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
function lo(e, t, r) {
  return r === "_blank" || fo(t) ? !1 : !(e.defaultPrevented || e.button > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}
function fo(e) {
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
const ho = N({
  name: "ToastController",
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = St();
    return () => C("div", r, t.default({ toasts: n.value }));
  }
}), po = N({
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
    return de(() => {
      o.value = setTimeout(() => s(), e.toast.duration * 1e3);
    }), he(() => {
      clearTimeout(o.value);
    }), () => C("li", r, t.default({ toast: e.toast, close: s }));
  }
}), _o = N({
  name: "PasswordConfirmationController",
  props: {
    action: { type: String, required: !0 }
  },
  slots: Object,
  setup(e, { slots: t, attrs: r }) {
    const n = _e(), o = _(), s = _(!1);
    function a(l) {
      o.value = l, s.value = !0;
    }
    async function i(l) {
      let { method: u, url: f, options: d } = o.value;
      return await n.post(e.action, l).then(async () => await n.dispatch(u, f, d).then(async (p) => (c(), await v(() => p))));
    }
    function c() {
      s.value = !1, o.value = void 0;
    }
    return de(() => {
      ue.addEventListener("password.confirm", a);
    }), he(() => {
      ue.removeEventListener("password.confirm", a);
    }), () => C("div", r, t.default({ open: s.value, submit: i, cancel: c }));
  }
});
function go(e, t) {
  return Et(vt(e), t);
}
function yo(e, t, r) {
  return Et(mo(vt(e), t), r);
}
function vt(e) {
  let t = APP_TRANSLATIONS[e];
  return typeof t > "u" && (t = e), t;
}
function mo(e, t) {
  let r = e.split("|"), n = wo(r, t);
  if (n)
    return n.trim();
  r = vo(r);
  let o = Eo(t);
  return r.length === 1 || r[o] == null ? r[0] : r[o];
}
function wo(e, t) {
  for (let r in e) {
    let n = So(r, t);
    if (n)
      return n;
  }
}
function So(e, t) {
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
function vo(e) {
  return e.map((t) => t.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ""));
}
function Et(e, t) {
  return t ? Object.keys(t).reduce((r, n) => r.replace(`:${n}`, t[n].toString()), e) : e;
}
function Eo(e) {
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
function bt(e, t, r, n) {
  const o = new URL(e, n || APP_URL);
  return t && bo(o.searchParams, t), r && (o.hash = r), o.toString();
}
function bo(e, t) {
  Object.keys(t).forEach((r) => {
    le(e, r, O(t[r]));
  });
}
function le(e, t, r, n) {
  return n && (t = n + "[" + t + "]"), r == null ? (e.append(t, ""), e) : Array.isArray(r) ? (r.forEach((o, s) => {
    le(e, s.toString(), o, t);
  }), e) : typeof r == "object" ? (Object.keys(r).forEach((o) => {
    le(e, o, r[o], t);
  }), e) : (typeof r == "boolean" && (r = Number(r)), r == null && (r = ""), e.append(t, r), e);
}
function Co(e, t = {}, r) {
  return Oo($o(e), t, r);
}
function $o(e) {
  return e.startsWith(APP_FALLBACK_LOCALE) ? e.replace(`${APP_FALLBACK_LOCALE}.`, "") : APP_AVAILABLE_LOCALES.findIndex((t) => e.startsWith(t)) >= 0 || !e.startsWith("web.") ? e : APP_LOCALE !== APP_FALLBACK_LOCALE ? `${APP_LOCALE}.${e}` : e;
}
function Oo(e, t, r) {
  const n = APP_ROUTES[e];
  if (!n)
    throw new Error(`Undefined route: ${e}`);
  const o = To(n, t), s = Object.keys(t).reduce((a, i) => (n.params.includes(i) || (a[i] = O(t[i])), a), {});
  return bt(o, s, r, n.domain);
}
function To(e, t) {
  return e.params.reduce((r, n) => {
    let o = e.binding[n] || "id", s = O(t[n]);
    if (typeof s == "object" && (s = s[o]), !s)
      throw new Error(`Parameter ${n} is required for uri ${e.uri}.`);
    return r.replace(new RegExp(`{${n}??}`), s);
  }, e.uri);
}
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function re(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
const xo = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const q = () => {
}, Ao = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), No = Object.assign, Oe = Array.isArray, I = (e) => typeof e == "function", y = (e) => typeof e == "string", Te = (e) => e !== null && typeof e == "object", z = (e) => (Te(e) || I(e)) && I(e.then) && I(e.catch), Po = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, Ro = /\B([A-Z])/g, ko = Po(
  (e) => e.replace(Ro, "-$1").toLowerCase()
);
let je;
const Lo = () => je || (je = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ct(e) {
  if (Oe(e)) {
    const t = {};
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = y(n) ? jo(n) : Ct(n);
      if (o)
        for (const s in o)
          t[s] = o[s];
    }
    return t;
  } else if (y(e) || Te(e))
    return e;
}
const Io = /;(?![^(]*\))/g, Vo = /:([^]+)/, Do = /\/\*[^]*?\*\//g;
function jo(e) {
  const t = {};
  return e.replace(Do, "").split(Io).forEach((r) => {
    if (r) {
      const n = r.split(Vo);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function Ho(e) {
  if (!e) return "";
  if (y(e)) return e;
  let t = "";
  for (const r in e) {
    const n = e[r];
    if (y(n) || typeof n == "number") {
      const o = r.startsWith("--") ? r : ko(r);
      t += `${o}:${n};`;
    }
  }
  return t;
}
function $t(e) {
  let t = "";
  if (y(e))
    t = e;
  else if (Oe(e))
    for (let r = 0; r < e.length; r++) {
      const n = $t(e[r]);
      n && (t += n + " ");
    }
  else if (Te(e))
    for (const r in e)
      e[r] && (t += r + " ");
  return t.trim();
}
const Mo = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Fo = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr", Bo = /* @__PURE__ */ re(Mo), Ko = /* @__PURE__ */ re(Fo), Uo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Go = /* @__PURE__ */ re(
  Uo + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected"
);
function qo(e) {
  return !!e || e === "";
}
const zo = /[>/="'\u0009\u000a\u000c\u0020]/, se = {};
function Wo(e) {
  if (se.hasOwnProperty(e))
    return se[e];
  const t = zo.test(e);
  return t && console.error(`unsafe attribute name: ${e}`), se[e] = !t;
}
const Yo = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
function Jo(e) {
  if (e == null)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean";
}
const Zo = /["'&<>]/;
function b(e) {
  const t = "" + e, r = Zo.exec(t);
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
const Xo = /^-?>|<!--|-->|--!>|<!-$/g;
function Qo(e) {
  return e.replace(Xo, "");
}
/**
* @vue/server-renderer v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const es = /* @__PURE__ */ re(
  ",key,ref,innerHTML,textContent,ref_key,ref_for"
);
function ts(e, t) {
  let r = "";
  for (const n in e) {
    if (es(n) || Ao(n) || t === "textarea" && n === "value")
      continue;
    const o = e[n];
    n === "class" ? r += ` class="${ns(o)}"` : n === "style" ? r += ` style="${os(o)}"` : n === "className" ? r += ` class="${String(o)}"` : r += rs(n, o, t);
  }
  return r;
}
function rs(e, t, r) {
  if (!Jo(t))
    return "";
  const n = r && (r.indexOf("-") > 0 || Bo(r)) ? e : Yo[e] || e.toLowerCase();
  return Go(n) ? qo(t) ? ` ${n}` : "" : Wo(n) ? t === "" ? ` ${n}` : ` ${n}="${b(t)}"` : (console.warn(
    `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${n}`
  ), "");
}
function ns(e) {
  return b($t(e));
}
function os(e) {
  if (!e)
    return "";
  if (y(e))
    return b(e);
  const t = Ct(e);
  return b(Ho(t));
}
function ss(e, t, r, n, o) {
  e("<!--teleport start-->");
  const s = o.appContext.provides[Ge], a = s.__teleportBuffers || (s.__teleportBuffers = {}), i = a[r] || (a[r] = []), c = i.length;
  let l;
  if (n)
    t(e), l = "<!--teleport start anchor--><!--teleport anchor-->";
  else {
    const { getBuffer: u, push: f } = Dt();
    f("<!--teleport start anchor-->"), t(f), f("<!--teleport anchor-->"), l = u();
  }
  i.splice(c, 0, l), e("<!--teleport end-->");
}
let as, Ot = 0, ae;
function is() {
  Ot++;
}
function cs() {
  if (--Ot > 0)
    return;
  let e;
  for (; ae; ) {
    let t = ae;
    for (ae = void 0; t; ) {
      const r = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = r;
    }
  }
  if (e) throw e;
}
let W = !0;
const Tt = [];
function xt() {
  Tt.push(W), W = !1;
}
function At() {
  const e = Tt.pop();
  W = e === void 0 ? !0 : e;
}
class us {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
  }
  trigger(t) {
    this.version++, this.notify(t);
  }
  notify(t) {
    is();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            No(
              {
                effect: r.sub
              },
              t
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      cs();
    }
  }
}
const He = /* @__PURE__ */ new WeakMap();
Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function Me(e, t, r) {
  if (W && as) {
    let n = He.get(e);
    n || He.set(e, n = /* @__PURE__ */ new Map());
    let o = n.get(r);
    o || (n.set(r, o = new us()), o.map = n, o.key = r), process.env.NODE_ENV !== "production" ? o.track({
      target: e,
      type: t,
      key: r
    }) : o.track();
  }
}
function fe(e) {
  const t = e && e.__v_raw;
  return t ? fe(t) : e;
}
function ls(e) {
  return e ? e.__v_isRef === !0 : !1;
}
const T = [];
function fs(e) {
  T.push(e);
}
function ds() {
  T.pop();
}
let ie = !1;
function Y(e, ...t) {
  if (ie) return;
  ie = !0, xt();
  const r = T.length ? T[T.length - 1].component : null, n = r && r.appContext.config.warnHandler, o = hs();
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
`, ...ps(o)), console.warn(...s);
  }
  At(), ie = !1;
}
function hs() {
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
function ps(e) {
  const t = [];
  return e.forEach((r, n) => {
    t.push(...n === 0 ? [] : [`
`], ..._s(r));
  }), t;
}
function _s({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : "", n = e.component ? e.component.parent == null : !1, o = ` at <${Lt(
    e.component,
    e.type,
    n
  )}`, s = ">" + r;
  return e.props ? [o, ...gs(e.props), s] : [o + s];
}
function gs(e) {
  const t = [], r = Object.keys(e);
  return r.slice(0, 3).forEach((n) => {
    t.push(...Nt(n, e[n]));
  }), r.length > 3 && t.push(" ..."), t;
}
function Nt(e, t, r) {
  return y(t) ? (t = JSON.stringify(t), r ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? r ? t : [`${e}=${t}`] : ls(t) ? (t = Nt(e, fe(t.value), !0), r ? t : [`${e}=Ref<`, t, ">"]) : I(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = fe(t), r ? t : [`${e}=`, t]);
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
  15: "component update",
  16: "app unmount cleanup function"
};
function Rt(e, t, r, n) {
  try {
    return n ? e(...n) : e();
  } catch (o) {
    ys(o, t, r);
  }
}
function ys(e, t, r, n = !0) {
  const o = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: a } = t && t.appContext.config || xo;
  if (t) {
    let i = t.parent;
    const c = t.proxy, l = process.env.NODE_ENV !== "production" ? Pt[r] : `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; i; ) {
      const u = i.ec;
      if (u) {
        for (let f = 0; f < u.length; f++)
          if (u[f](e, c, l) === !1)
            return;
      }
      i = i.parent;
    }
    if (s) {
      xt(), Rt(s, null, 10, [
        e,
        c,
        l
      ]), At();
      return;
    }
  }
  ms(e, r, o, n, a);
}
function ms(e, t, r, n = !0, o = !1) {
  if (process.env.NODE_ENV !== "production") {
    const s = Pt[t];
    if (r && fs(r), Y(`Unhandled error${s ? ` during execution of ${s}` : ""}`), r && ds(), n)
      throw e;
    console.error(e);
  } else {
    if (o)
      throw e;
    console.error(e);
  }
}
let k, F = [];
function kt(e, t) {
  var r, n;
  k = e, k ? (k.enabled = !0, F.forEach(({ event: o, args: s }) => k.emit(o, ...s)), F = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((n = (r = window.navigator) == null ? void 0 : r.userAgent) != null && n.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((s) => {
    kt(s, t);
  }), setTimeout(() => {
    k || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, F = []);
  }, 3e3)) : F = [];
}
{
  const e = Lo(), t = (r, n) => {
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
const ws = /(?:^|[-_])(\w)/g, Ss = (e) => e.replace(ws, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function vs(e, t = !0) {
  return I(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Lt(e, t, r = !1) {
  let n = vs(t);
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
  return n ? Ss(n) : r ? "App" : "Anonymous";
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function Es(e, t) {
  throw new Error(
    "On-the-fly template compilation is not supported in the ESM build of @vue/server-renderer. All templates must be pre-compiled into render functions."
  );
}
const {
  createComponentInstance: bs,
  setCurrentRenderingInstance: Fe,
  setupComponent: Cs,
  renderComponentRoot: Be,
  normalizeVNode: $s,
  pushWarningContext: It,
  popWarningContext: Vt
} = qe;
function Dt() {
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
      t.push(r), e = n, (z(r) || Oe(r) && r.hasAsync) && (t.hasAsync = !0);
    }
  };
}
function jt(e, t = null, r) {
  const n = e.component = bs(
    e,
    t,
    null
  );
  process.env.NODE_ENV !== "production" && It(e);
  const o = Cs(
    n,
    !0
    /* isSSR */
  );
  process.env.NODE_ENV !== "production" && Vt();
  const s = z(o);
  let a = n.sp;
  return s || a ? Promise.resolve(o).then(() => {
    if (s && (a = n.sp), a)
      return Promise.all(
        a.map((c) => c.call(n.proxy))
      );
  }).catch(q).then(() => Ke(n, r)) : Ke(n, r);
}
function Ke(e, t) {
  process.env.NODE_ENV !== "production" && It(e.vnode);
  const r = e.type, { getBuffer: n, push: o } = Dt();
  if (I(r)) {
    let s = Be(e);
    if (!r.props)
      for (const a in e.attrs)
        a.startsWith("data-v-") && ((s.props || (s.props = {}))[a] = "");
    J(o, e.subTree = s, e, t);
  } else {
    (!e.render || e.render === q) && !e.ssrRender && !r.ssrRender && y(r.template) && (r.ssrRender = Es(r.template));
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
  return process.env.NODE_ENV !== "production" && Vt(), n();
}
function J(e, t, r, n) {
  const { type: o, shapeFlag: s, children: a, dirs: i, props: c } = t;
  switch (i && (t.props = Ts(t, c, i)), o) {
    case Xt:
      e(b(a));
      break;
    case Zt:
      e(
        a ? `<!--${Qo(a)}-->` : "<!---->"
      );
      break;
    case Jt:
      e(a);
      break;
    case Yt:
      t.slotScopeIds && (n = (n ? n + " " : "") + t.slotScopeIds.join(" ")), e("<!--[-->"), xe(
        e,
        a,
        r,
        n
      ), e("<!--]-->");
      break;
    default:
      s & 1 ? Os(e, t, r, n) : s & 6 ? e(jt(t, r, n)) : s & 64 ? xs(e, t, r, n) : s & 128 ? J(e, t.ssContent, r, n) : K(
        "[@vue/server-renderer] Invalid VNode type:",
        o,
        `(${typeof o})`
      );
  }
}
function xe(e, t, r, n) {
  for (let o = 0; o < t.length; o++)
    J(e, $s(t[o]), r, n);
}
function Os(e, t, r, n) {
  const o = t.type;
  let { props: s, children: a, shapeFlag: i, scopeId: c } = t, l = `<${o}`;
  s && (l += ts(s, o)), c && (l += ` ${c}`);
  let u = r, f = t;
  for (; u && f === u.subTree; )
    f = u.vnode, f.scopeId && (l += ` ${f.scopeId}`), u = u.parent;
  if (n && (l += ` ${n}`), e(l + ">"), !Ko(o)) {
    let d = !1;
    s && (s.innerHTML ? (d = !0, e(s.innerHTML)) : s.textContent ? (d = !0, e(b(s.textContent))) : o === "textarea" && s.value && (d = !0, e(b(s.value)))), d || (i & 8 ? e(b(a)) : i & 16 && xe(
      e,
      a,
      r,
      n
    )), e(`</${o}>`);
  }
}
function Ts(e, t, r) {
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
  return Qt(t || {}, ...n);
}
function xs(e, t, r, n) {
  const o = t.props && t.props.to, s = t.props && t.props.disabled;
  if (!o)
    return s || K("[@vue/server-renderer] Teleport is missing target prop."), [];
  if (!y(o))
    return K(
      "[@vue/server-renderer] Teleport target must be a query selector string."
    ), [];
  ss(
    e,
    (a) => {
      xe(
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
const { isVNode: As } = qe;
function B(e, t, r) {
  if (!e.hasAsync)
    return t + Mt(e);
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
function Ht(e) {
  return B(e, "", 0);
}
function Mt(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    let n = e[r];
    y(n) ? t += n : t += Mt(n);
  }
  return t;
}
async function Ft(e, t = {}) {
  if (As(e))
    return Ft(zt({ render: () => e }), t);
  const r = Wt(e._component, e._props);
  r.appContext = e._context, e.provide(Ge, t);
  const n = await jt(r), o = await Ht(n);
  if (await Ns(t), t.__watcherHandles)
    for (const s of t.__watcherHandles)
      s();
  return o;
}
async function Ns(e) {
  if (e.__teleportBuffers) {
    e.teleports = e.teleports || {};
    for (const t in e.__teleportBuffers)
      e.teleports[t] = await Ht(
        await Promise.all([e.__teleportBuffers[t]])
      );
  }
}
qt();
const Ps = N({
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
        location: O(M(t)),
        signature: O(M(n)),
        stack: O(M(r))
      };
    }
    async function a(c) {
      return t.value = c.location, n.value = c.signature, c.stack && (r.value = Je(O(M(r.value)), c.stack)), c.toasts && c.toasts.length > 0 && (o.value = [...o.value, ...c.toasts]), await v(() => s());
    }
    g(ze, t), g(We, n), g(Ye, a), g(pt, e.resolver), g($e, S(() => 0)), g(Ce, r), g(wt, o);
    function i(c) {
      c.state ? (t.value = c.state.location, r.value = c.state.stack, n.value = c.state.signature) : (window.history.replaceState(s(), "", t.value), window.scroll(0, 0));
    }
    return de(() => {
      window.history.replaceState(s(), "", t.value), window.addEventListener("popstate", i);
    }), he(() => {
      window.removeEventListener("popstate", i);
    }), () => C(mt, { allowLayouts: !0 });
  }
});
async function Fs({ initial: e, resolver: t, setup: r }) {
  const n = typeof window > "u", o = e || Rs(), s = r({ router: Ps, props: { resolver: t, state: o } });
  return n ? await Ft(s) : "";
}
function Rs() {
  let e = document.getElementById("ias");
  if (!e || !e.textContent)
    throw new Error("Cannot find initial script element with MVC state.");
  return JSON.parse(e.textContent);
}
const L = _();
async function Ue(e, t) {
  return new Promise((r, n) => {
    function o() {
      L.value.processing = !0, v(() => {
        Promise.resolve(t()).then((a) => {
          L.value = void 0, v(() => r(a));
        }).catch((a) => {
          L.value = void 0, v(() => n(a));
        });
      });
    }
    function s() {
      L.value = void 0, v(() => n());
    }
    L.value = { ...e, processing: !1, confirm: o, cancel: s };
  });
}
async function ks(e, t) {
  return t !== void 0 ? Ue(e, t) : Ue({}, e);
}
function Bs() {
  return L;
}
function Ks() {
  return ks;
}
function Us() {
  return m(be, null);
}
function Gs() {
  let e = m(be);
  if (!e)
    throw new Error("Accessing form outside of context.");
  return e;
}
function qs() {
  const e = m(gt);
  if (!e)
    throw new Error("You're trying to get stacked view parent out of Router context!");
  return e;
}
function Ls() {
  const e = m(_t);
  if (!e)
    throw new Error("You're trying to get parent view out of Router context!");
  return e;
}
function zs() {
  const e = Ls();
  return S(() => {
    if (e && e.value && e.value.location)
      return bt(e.value.location, e.value.query);
  });
}
function Ws() {
  const e = m(yt);
  if (!e)
    throw new Error("You're trying to get stacked view query params out of Router context!");
  return e;
}
function Is(e) {
  return e == null ? !0 : typeof e == "number" || typeof e == "boolean" ? !1 : typeof e == "string" ? e.trim() === "" : e instanceof Array ? e.length > 0 : e instanceof Set || e instanceof Map ? e.size > 0 : !e;
}
function Ys(e) {
  return !Is(e);
}
function Js(e = 16) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(e / 2))), (t) => ("0" + (t & 255).toString(16)).slice(-2)).join("");
}
function Zs(e) {
  return e.filter((t) => t.parentId === null);
}
function Xs(e, t) {
  return e.filter((r) => r.left > t.left && r.right < t.right && r.parentId === t.id);
}
function Qs(e, t) {
  return e.filter((r) => r.left < t.left && r.right > t.right);
}
function ea(e, t) {
  return e.filter((r) => r.left > t.left && r.right < t.right);
}
var Vs = /* @__PURE__ */ ((e) => (e.SUCCESS = "success", e.DANGER = "danger", e.INFO = "info", e.WARNING = "warning", e))(Vs || {});
function ta() {
  return {
    install(e) {
      e.component("RouterView", mt), e.component("RouterLink", uo), e.component("FormController", oo), e.component("ToastController", ho), e.component("PasswordConfirmationController", _o), e.component("Toast", po), e.config.globalProperties.$t = go, e.config.globalProperties.$tc = yo, e.config.globalProperties.$route = Co;
    }
  };
}
export {
  U as CompleteResponse,
  nr as ErrorModal,
  ue as EventBus,
  be as FormContextInjectionKey,
  oo as FormControllerComponent,
  pe as Request,
  ce as Response,
  Ps as RouterComponent,
  uo as RouterLinkComponent,
  mt as RouterViewComponent,
  $e as StackedViewDepthInjectionKey,
  Ce as StackedViewInjectionKey,
  gt as StackedViewLocationInjectionKey,
  _t as StackedViewParentInjectionKey,
  yt as StackedViewQueryInjectionKey,
  pt as StackedViewResolverInjectionKey,
  ze as StateLocationInjectionKey,
  Ye as StateManagerInjectionKey,
  We as StateStackSignatureInjectionKey,
  po as ToastComponent,
  ho as ToastControllerComponent,
  Vs as ToastKind,
  wt as ToastRegistryInjectionKey,
  Is as blank,
  no as createFormContext,
  Fs as createFoundationController,
  ta as createOtherSoftwareFoundation,
  Ys as filled,
  Ms as getModelFromContext,
  Js as hash,
  Qs as nestedSetAncestors,
  Xs as nestedSetChildren,
  ea as nestedSetDescendants,
  Zs as nestedSetRoot,
  Co as route,
  Hs as setModelWithContext,
  go as trans,
  yo as transChoice,
  Je as updateStack,
  bt as url,
  Ks as useConfirmation,
  Bs as useCurrentConfirmation,
  Us as useFromContext,
  _e as useHttpClient,
  er as useLocation,
  Gs as usePersistentFormContext,
  tr as useStackSignature,
  rr as useStateManager,
  St as useToasts,
  co as useViewDepth,
  qs as useViewLocation,
  Ls as useViewParent,
  zs as useViewParentLocation,
  Ws as useViewQuery,
  ao as useViewResolver,
  io as useViewStack,
  so as wrap
};
//# sourceMappingURL=other-software-foundation.js.map

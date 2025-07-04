import { normalizePath as a } from "vite";
import l from "node:fs";
import i, { basename as T, parse as D, resolve as h } from "node:path";
function S(t, e = [".vue"], n = []) {
  return l.existsSync(t) && l.readdirSync(t).forEach((p) => {
    const o = i.join(t, p);
    l.statSync(o).isDirectory() ? n = S(o, e, n) : e.forEach((u) => {
      o.endsWith(u) && n.push(o);
    });
  }), n;
}
function c(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function O(t, e, n = void 0) {
  e = a(e), t = a(t);
  let r = e.replace(t, "").replace(/^\//, "").replace(".vue", "").split("/").join(".");
  return n ? n + "::" + r : r;
}
function $(t, e, n = void 0) {
  e = a(e), t = a(t);
  let r = e.replace(t, "").replace(/^\//, "").replace(".vue", "").split("/");
  return n && r.unshift(n), r.map(c).join("");
}
function I(t, e = void 0) {
  t = a(t);
  let n = T(t), r = D(n), p = c(r.name);
  return e ? c(e) + p : p;
}
function A(t, e, n = void 0) {
  const r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  return Array.isArray(e) && (e = Object.fromEntries(e.map((o) => [o, void 0]))), typeof e == "string" && (e = { [e]: void 0 }), Object.entries(e).forEach(([o, s]) => {
    s && f(h(t.root, s), p, r, n), f(h(t.root, o), p, void 0, n);
  }), { components: p, vendors: r };
}
function f(t, e, n = void 0, r = void 0) {
  S(t).forEach((p) => {
    let o = I(p, r), s = O(t, p, r), u = $(t, p, r);
    p = a(p), n && n.set(u, { global: o, name: u, laravel: s, path: p }), e.set(u, { global: o, name: u, laravel: s, path: p });
  });
}
function V(t) {
  let e = [];
  return t.forEach((n) => e.push(`import ${n.global} from '${n.path}';`)), e.push("export {"), t.forEach((n) => e.push(`  ${n.global},`)), e.push("};"), e.push(""), e.push("export function createOtherSoftwareAutoloader() {"), e.push("  return {"), e.push("    install(app) {"), t.forEach((n) => e.push(`      app.component('${n.global}', ${n.global});`)), e.push("    },"), e.push("  };"), e.push("};"), e.push(""), e.join(`
`);
}
function m(t, e, n) {
  let r = i.resolve(t.root, e), p = i.resolve(r, "components.d.ts"), o = [];
  o.push("// THIS FILE IS AUTOGENERATED!"), o.push("// DO NOT EDIT!"), o.push(""), o.push("declare module '@app/components' {"), o.push("  import { Plugin } from 'vue';"), o.push("  export function createOtherSoftwareAutoloader(): Plugin;"), o.push(""), n.forEach((s) => o.push(`  export { default as ${s.global} } from '${a(i.relative(r, s.path))}';`)), o.push("}"), o.push(""), l.writeFileSync(p, o.join(`
`));
}
function d(t, e, n) {
  let r = i.resolve(t.root, e), p = i.resolve(r, "vue.d.ts"), o = [];
  o.push("// THIS FILE IS AUTOGENERATED!"), o.push("// DO NOT EDIT!"), o.push(""), o.push("declare module '@vue/runtime-core' {"), o.push("  export interface GlobalComponents {"), n.forEach((s) => o.push(`    ${s.global}: typeof import('${a(i.relative(r, s.path))}')['default'],`)), o.push("  }"), o.push("}"), o.push(""), o.push("export {}"), o.push(""), l.writeFileSync(p, o.join(`
`));
}
function g(t) {
  return Array.isArray(t) ? [t.at(0), void 0] : typeof t == "string" ? [t, void 0] : Object.entries(t).at(0);
}
function v(t, e, n = !0) {
  const r = g(e.target);
  if (!r)
    throw new Error("Unknown target for output files!");
  let [p, o] = r, s = A(t, e.components);
  return o && (m(t, o, s.vendors), d(t, o, s.vendors)), m(t, p, s.components), d(t, p, s.components), n ? V(s.components) : null;
}
function j(t) {
  let e = [];
  return t.forEach((n) => e.push(`import ${n.name} from '${n.path}';`)), e.push(""), e.push("const ViewsRepository = {"), t.forEach((n) => e.push(`  '${n.laravel}': ${n.name},`)), e.push("};"), e.push(""), e.push("export function createViewResolver(name) {"), e.push("  const view = ViewsRepository[name];"), e.push(""), e.push("  if (!view) {"), e.push(`    throw new Error('View "' + name + '" not found!');`), e.push("  }"), e.push(""), e.push("  return view;"), e.push("}"), e.push(""), e.join(`
`);
}
function w(t, e) {
  let n = i.resolve(t.root, e), r = i.resolve(n, "views.d.ts"), p = [];
  p.push("// THIS FILE IS AUTOGENERATED!"), p.push("// DO NOT EDIT!"), p.push(""), p.push("declare module '@app/views' {"), p.push("  export function createViewResolver(name: string): any;"), p.push("}"), p.push(""), l.writeFileSync(r, p.join(`
`));
}
function E(t, e, n) {
  let r = i.resolve(t.root, e), p = i.resolve(r, ".phpstorm.meta.php"), o = [], s = [];
  n.forEach((u) => s.push(`'${u.laravel}'`)), o.push("<?php"), o.push(""), o.push("namespace PHPSTORM_META {"), o.push(`  registerArgumentsSet('vueApplicationViews', ${s.join(", ")});`), o.push(""), o.push("  expectedArguments(\\OtherSoftware\\Bridge\\ResponseFactory::view(), 0, argumentsSet('vueApplicationViews'));"), o.push("  expectedArguments(\\OtherSoftware\\Support\\Facades\\Vue::view(), 0, argumentsSet('vueApplicationViews'));"), o.push("}"), o.push(""), l.writeFileSync(p, o.join(`
`));
}
function y(t, e, n = !0) {
  const r = g(e.target);
  if (!r)
    throw new Error("Unknown target for output files!");
  let [p, o] = r;
  const s = A(t, e.views, e.namespace);
  return o && (w(t, o), E(t, o, s.vendors)), w(t, p), E(t, p, s.components), n ? j(s.components) : null;
}
function R(t) {
  let e;
  function n(r) {
    v(e, t, !1), y(e, t, !1);
    const p = r.moduleGraph.getModuleById("\0@app/components"), o = r.moduleGraph.getModuleById("\0@app/views");
    p && r.reloadModule(p), o && r.reloadModule(o);
  }
  return {
    name: "vue-autoloader",
    configResolved(r) {
      e = r;
    },
    resolveId(r) {
      if (r === "@app/components") return "\0@app/components";
      if (r === "@app/views") return "\0@app/views";
    },
    load(r) {
      if (r === "\0@app/components") return v(e, t);
      if (r === "\0@app/views") return y(e, t);
    },
    configureServer(r) {
      const p = (o) => {
        o.endsWith(".vue") && n(r);
      };
      r.watcher.on("add", p), r.watcher.on("unlink", p), r.watcher.on("addDir", p), r.watcher.on("unlinkDir", p);
    }
  };
}
export {
  R as default
};

"use strict";const u=require("node:fs"),p=require("node:path"),i=require("vite");function g(t){let e=[];return t.forEach(r=>e.push(`import ${r.global} from '${r.path}';`)),e.push("export {"),t.forEach(r=>e.push(`  ${r.global},`)),e.push("};"),e.push(""),e.push("export function createOtherSoftwareAutoloader() {"),e.push("  return {"),e.push("    install(app) {"),t.forEach(r=>e.push(`      app.component('${r.global}', ${r.global});`)),e.push("    },"),e.push("  };"),e.push("};"),e.push(""),e.join(`
`)}function c(t,e,r){let n=p.resolve(t.root,e),s=p.resolve(n,"components.d.ts"),o=[];o.push("// THIS FILE IS AUTOGENERATED!"),o.push("// DO NOT EDIT!"),o.push(""),o.push("declare module '@app/components' {"),o.push("  import { Plugin } from 'vue';"),o.push("  export function createOtherSoftwareAutoloader(): Plugin;"),o.push(""),r.forEach(a=>o.push(`  export { default as ${a.global} } from '${i.normalizePath(p.relative(n,a.path))}';`)),o.push("}"),o.push(""),u.writeFileSync(s,o.join(`
`))}function h(t,e,r){let n=p.resolve(t.root,e),s=p.resolve(n,"vue.d.ts"),o=[];o.push("// THIS FILE IS AUTOGENERATED!"),o.push("// DO NOT EDIT!"),o.push(""),o.push("declare module '@vue/runtime-core' {"),o.push("  export interface GlobalComponents {"),r.forEach(a=>o.push(`    ${a.global}: typeof import('${i.normalizePath(p.relative(n,a.path))}')['default'],`)),o.push("  }"),o.push("}"),o.push(""),o.push("export {}"),o.push(""),u.writeFileSync(s,o.join(`
`))}function E(t,e=[".vue"],r=[]){return u.existsSync(t)&&u.readdirSync(t).forEach(s=>{const o=p.join(t,s);u.statSync(o).isDirectory()?r=E(o,e,r):e.forEach(l=>{o.endsWith(l)&&r.push(o)})}),r}function T(t){return t.replace(/[A-Z]/g,(e,r)=>(r!==0?"_":"")+e.toLowerCase())}function y(t){return t.charAt(0).toUpperCase()+t.slice(1)}function D(t,e){return e=i.normalizePath(e),t=i.normalizePath(t),e.replace(t,"").replace(/^\//,"").replace(".vue","").split("/").map(T).join(".")}function O(t,e){return e=i.normalizePath(e),t=i.normalizePath(t),e.replace(t,"").replace(/^\//,"").replace(".vue","").split("/").map(y).join("")}function $(t){t=i.normalizePath(t);let e=p.basename(t),r=p.parse(e);return y(r.name)}function S(t,e){const r=new Map,n=new Map;return Array.isArray(e)&&(e=Object.fromEntries(e.map(s=>[s,void 0]))),typeof e=="string"&&(e={[e]:void 0}),Object.entries(e).forEach(([s,o])=>{o&&f(p.resolve(t.root,o),n,r),f(p.resolve(t.root,s),n)}),{components:n,vendors:r}}function f(t,e,r=void 0){E(t).forEach(n=>{let s=$(n),o=D(t,n),a=O(t,n);n=i.normalizePath(n),r&&r.set(a,{global:s,name:a,laravel:o,path:n}),e.set(a,{global:s,name:a,laravel:o,path:n})})}function A(t){return Array.isArray(t)?[t.at(0),void 0]:typeof t=="string"?[t,void 0]:Object.entries(t).at(0)}function m(t,e,r=!0){const n=A(e.target);if(!n)throw new Error("Unknown target for output files!");let[s,o]=n,a=S(t,e.components);return o&&(c(t,o,a.vendors),h(t,o,a.vendors)),c(t,s,a.components),h(t,s,a.components),r?g(a.components):null}function I(t){let e=[];return t.forEach(r=>e.push(`import ${r.name} from '${r.path}';`)),e.push(""),e.push("const ViewsRepository = {"),t.forEach(r=>e.push(`  '${r.laravel}': ${r.name},`)),e.push("};"),e.push(""),e.push("export function createViewResolver(name) {"),e.push("  const view = ViewsRepository[name];"),e.push(""),e.push("  if (!view) {"),e.push(`    throw new Error('View "' + name + '" not found!');`),e.push("  }"),e.push(""),e.push("  return view;"),e.push("}"),e.push(""),e.join(`
`)}function d(t,e){let r=p.resolve(t.root,e),n=p.resolve(r,"views.d.ts"),s=[];s.push("// THIS FILE IS AUTOGENERATED!"),s.push("// DO NOT EDIT!"),s.push(""),s.push("declare module '@app/views' {"),s.push("  export function createViewResolver(name: string): any;"),s.push("}"),s.push(""),u.writeFileSync(n,s.join(`
`))}function w(t,e,r){let n=p.resolve(t.root,e),s=p.resolve(n,".phpstorm.meta.php"),o=[],a=[];r.forEach(l=>a.push(`'${l.laravel}'`)),o.push("<?php"),o.push(""),o.push("namespace PHPSTORM_META {"),o.push(`  registerArgumentsSet('vueApplicationViews', ${a.join(", ")});`),o.push(""),o.push("  expectedArguments(\\OtherSoftware\\Bridge\\ResponseFactory::view(), 0, argumentsSet('vueApplicationViews'));"),o.push("  expectedArguments(\\OtherSoftware\\Support\\Facades\\Vue::view(), 0, argumentsSet('vueApplicationViews'));"),o.push("}"),o.push(""),u.writeFileSync(s,o.join(`
`))}function v(t,e,r=!0){const n=A(e.target);if(!n)throw new Error("Unknown target for output files!");let[s,o]=n;const a=S(t,e.views);return o&&(d(t,o),w(t,o,a.vendors)),d(t,s),w(t,s,a.components),r?I(a.components):null}function P(t){let e;function r(n){m(e,t,!1),v(e,t,!1);const s=n.moduleGraph.getModuleById("\0@app/components"),o=n.moduleGraph.getModuleById("\0@app/views");s&&n.reloadModule(s),o&&n.reloadModule(o)}return{name:"vue-autoloader",configResolved(n){e=n},resolveId(n){if(n==="@app/components")return"\0@app/components";if(n==="@app/views")return"\0@app/views"},load(n){if(n==="\0@app/components")return m(e,t);if(n==="\0@app/views")return v(e,t)},configureServer(n){const s=o=>{o.endsWith(".vue")&&r(n)};n.watcher.on("add",s),n.watcher.on("unlink",s),n.watcher.on("addDir",s),n.watcher.on("unlinkDir",s)}}}module.exports=P;

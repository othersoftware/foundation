import * as n from "node:path";
function m(o = {}) {
  const {
    target: l = "resources/views",
    exclude: i = []
  } = o;
  let s;
  return {
    name: "vite-plugin-vue-router",
    enforce: "pre",
    configResolved(e) {
      s = e;
    },
    async transform(e, r) {
      const u = n.join(s.root, l);
      if (!(!n.normalize(r).startsWith(u) || !r.endsWith(".vue") || i.some((t) => r.includes(t)))) {
        if (e.includes("<template>") && !e.includes("<RouterView") && !e.includes("<router-view")) {
          const t = e.lastIndexOf("</template>"), a = e.slice(0, t), c = e.slice(t);
          return `${a}
  <RouterView />
${c}`;
        }
        return e;
      }
    }
  };
}
export {
  m as default
};

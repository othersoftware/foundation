import * as s from "node:path";
function c(l = {}) {
  const {
    target: o = "resources/views",
    exclude: u = []
  } = l;
  let n;
  return {
    name: "vite-plugin-vue-router",
    enforce: "pre",
    configResolved(e) {
      n = e;
    },
    async transform(e, r) {
      const a = s.join(n.root, o);
      if (!s.normalize(r).startsWith(a) || !r.endsWith(".vue") || u.some((t) => r.includes(t)))
        return { code: e, map: null };
      if (e.includes("<template>") && !e.includes("<RouterView") && !e.includes("<router-view")) {
        const t = e.lastIndexOf("</template>"), i = e.slice(0, t), m = e.slice(t);
        return { code: `${i}
  <RouterView />
${m}`, map: null };
      }
      return { code: e, map: null };
    }
  };
}
export {
  c as default
};

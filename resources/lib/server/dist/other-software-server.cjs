"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const process = require("node:process");
const node_http = require("node:http");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const process__namespace = /* @__PURE__ */ _interopNamespaceDefault(process);
const readableToString = (readable) => new Promise((resolve, reject) => {
  let data = "";
  readable.on("data", (chunk) => data += chunk);
  readable.on("end", () => resolve(data));
  readable.on("error", (err) => reject(err));
});
function startRenderingService(render, port = 2137) {
  const routes = {
    "/health": async () => ({ status: "OK", timestamp: Date.now() }),
    "/shutdown": () => process__namespace.exit(),
    "/render": async (request) => render(JSON.parse(await readableToString(request))),
    "/404": async () => ({ status: "NOT_FOUND", timestamp: Date.now() })
  };
  node_http.createServer(async (request, response) => {
    const dispatchRoute = routes[request.url] || routes["/404"];
    try {
      response.writeHead(200, { "Content-Type": "text/html", Server: "OtherCommerce Visitor SSR" });
      response.write(await dispatchRoute(request));
    } catch (e) {
      console.error(e);
    }
    response.end();
  }).listen(port, () => {
    console.log("Rendering service started started.");
  });
  console.log(`Starting rendering service on port ${port}...`);
}
exports.startRenderingService = startRenderingService;
//# sourceMappingURL=other-software-server.cjs.map

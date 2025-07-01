import * as process from "node:process";
import { createServer } from "node:http";
const readableToString = (readable) => new Promise((resolve, reject) => {
  let data = "";
  readable.on("data", (chunk) => data += chunk);
  readable.on("end", () => resolve(data));
  readable.on("error", (err) => reject(err));
});
function startRenderingService(render, port = 2137) {
  const routes = {
    "/health": async () => ({ status: "OK", timestamp: Date.now() }),
    "/shutdown": () => process.exit(),
    "/render": async (request) => render(JSON.parse(await readableToString(request))),
    "/404": async () => ({ status: "NOT_FOUND", timestamp: Date.now() })
  };
  createServer(async (request, response) => {
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
export {
  startRenderingService
};
//# sourceMappingURL=other-software-server.js.map

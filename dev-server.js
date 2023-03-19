import http from "http";
import path, { basename } from "path";
import fs from "fs";
import mime from "mime";
import WebSocket, { WebSocketServer } from "ws";
import watch from "node-watch";

const reloadScript = fs.readFileSync("./reload-client.js");
const ROOT = path.resolve("./dist");
const PORT = 8000;
const WS_PORT = 8081;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    const body = `Forbidden Method: ${req.method}`;
    res.writeHead(403, {
      "Content-Type": "plain/text",
      "Content-Length": Buffer.byteLength(body),
    });
    return res.end(body);
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  try {
    const resourcePath = path.join(ROOT, pathname);
    let body = await fs.promises.readFile(resourcePath);
    console.log(`Serving: ${path.relative(ROOT, resourcePath)}`);

    if (resourcePath.endsWith(".html")) {
      body = body
        .toString()
        .replace("</body>", `<script>${reloadScript}</script></body>`);
    }
    res.writeHead(200, {
      "Content-Type": mime.getType(resourcePath),
      "Content-Length": body.length,
    });
    return res.end(body);
  } catch (e) {
    const body = `Cannot GET resource: ${pathname}`;
    console.log(`404: ${body}`);
    res.writeHead(404, {
      "Content-Type": "plain/text",
      "Content-Length": Buffer.byteLength(body),
    });
    return res.end(body);
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running on port: ${PORT}`);
});

const reloadServer = new WebSocketServer({
  port: WS_PORT,
});

reloadServer.on("listening", () => {
  console.log(`Websocket server running on port: ${WS_PORT}`);
});

reloadServer.on("reload", (data) => {
  const msg = JSON.stringify({
    event: "reload",
    file: data,
  });
  reloadServer.clients.forEach((client) => client.send(msg));
});

watch(ROOT, { recursive: true }, (evt, name) => {
  console.log("%s changed.", path.relative(ROOT, name));
  reloadServer.emit("reload", path.relative(ROOT, name));
});

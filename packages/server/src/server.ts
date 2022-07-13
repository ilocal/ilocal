import app from "./app";
import http from "http";
import { parse } from "tldts";
import Manager from "./manager";
import Client from "./client";
import logger from "./logger";

interface Options {}

const manager = new Manager();
function getClientFromRequest(req: http.IncomingMessage): Client | null {
  const { host = "" } = req.headers;
  const { subdomain } = parse(host);

  if (!subdomain) {
    return null;
  }

  const [clientId] = subdomain.split(".");
  return manager.getClient(clientId);
}
export default class Server {
  server: http.Server;
  constructor(options: Partial<Options> = {}) {
    this.server = http.createServer();

    this.server
      .on("request", (req, res) => {
        logger.info("%s %s %s", req.method, req.headers.host, req.url);
        const client = getClientFromRequest(req);
        if (!client) {
          return app(req, res);
        }
        client.handleRequest(req, res);
      })
      .on("upgrade", (req, socket) => {
        const client = getClientFromRequest(req);
        if (!client) {
          return socket.destroy();
        }
        client.handleUpgrade(req, socket);
      });
  }

  destroy() {
    this.server.close();
  }
}

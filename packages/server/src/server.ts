import app from "./app";
import http from "http";
import { parse } from "tldts";
import manager from "./manager";
import Client from "./client";
import logger from "./logger";

interface Options {}

async function getClientFromRequest(req: http.IncomingMessage): Promise<Client | null> {
  // console.log(req.headers);
  const { host = "" } = req.headers;
  const { subdomain } = parse(host);

  if (!subdomain) {
    return null;
  }

  const [clientId] = subdomain.split(".");
  return manager.getClient(clientId, false);
}
export default class Server {
  server: http.Server;
  constructor(options: Partial<Options> = {}) {
    console.log(options);
    this.server = http.createServer();
    this.server
      .on("request", async (req, res) => {
        logger.info("%s %s %s", req.method, req.headers.host, req.url);
        const client = await getClientFromRequest(req);
        if (!client) {
          return app(req, res);
        }
        client.handleRequest(req, res);
      })
      .on("upgrade", async (req, socket) => {
        const client = await getClientFromRequest(req);
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

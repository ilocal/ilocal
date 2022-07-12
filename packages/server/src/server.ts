import app from "./app";
// import logger from "./logger";
import http from "http";

interface Options {}
export default class Server {
  server: http.Server;
  constructor(options: Partial<Options> = {}) {
    this.server = http.createServer(app);

    this.server
      .on("request", (req, res) => {
        const hostname = req.headers.host;
        console.log(hostname);
      })
      .on("upgrade", (req, socket, head) => {
        const hostname = req.headers.host;
        if (!hostname) {
          socket.destroy();
          return;
        }
      });
  }

  destroy() {
    this.server.close();
  }
}

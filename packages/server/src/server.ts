import express from "express";
import logger from "./logger";
import http from "http";

interface Options {
  port: number;
}
export default class Server {
  server: http.Server;
  constructor(options: Partial<Options> = {}) {
    // 处理默认参数
    options = Object.assign(
      {
        port: 1024,
      },
      options
    );

    const app = express();

    this.server = app.listen(options.port, () => {
      logger.info("Server listening on port " + options.port);
    });
  }

  destroy() {
    this.server.close();
  }
}

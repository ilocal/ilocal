import { Agent, AgentOptions, ClientRequestArgs } from "http";
import net, { Socket } from "net";
import logger from "./logger";

export default class IlocalAgent extends Agent {
  server: net.Server;
  port: number = 0;
  started: boolean = false;
  closed: boolean = false;

  availableSockets: net.Socket[] = [];

  private onClose() {
    this.closed = true;
    console.log("Agent closed");
  }
  private onConnection(socket: net.Socket) {
    socket
      .on("close", (hasError: boolean) => {
        logger.info("Client Closed %s", socket.address());
      })
      .on("error", (err: Error) => {
        logger.info("Client Error %s", socket.address());
        socket.destroy();
      });
    this.availableSockets.push(socket);
    logger.info("Agent Listening %s", socket.address());
  }

  constructor(options?: AgentOptions) {
    super(
      Object.assign(
        {
          keepAlive: true,
        },
        options
      )
    );
    this.server = net.createServer();
  }

  // Agent 启用
  listen(): Promise<net.AddressInfo> {
    if (this.started) {
      const err = new Error("already started");
      logger.error(err);
      throw err;
    }
    this.server
      .once("close", this.onClose.bind(this))
      .on("connection", this.onConnection.bind(this))
      .on("error", (err) => {
        if (err.name == "ECONNRESET" || err.name == "ETIMEDOUT") {
          return;
        }
        logger.error(err);
      });

    return new Promise((resolve, reject) => {
      this.server.listen(() => {
        const address = this.server.address();
        if (typeof address === "string") {
          this.port = 0;
          resolve({ address, family: "", port: this.port });
        } else if (address === null) {
          reject();
        } else {
          this.port = address.port;
          resolve(address);
        }
      });
    });
  }

  createConnection(options: ClientRequestArgs, oncreate: (err: Error, socket: Socket) => void): net.Socket {
    console.log("createConnection");
    if (this.closed) {
      oncreate(new Error("agent closed"), null);
      return;
    }
    const socket = this.availableSockets.shift();
    oncreate(null, socket);
    return socket;
  }

  destroy() {
    this.server.close();
    super.destroy();
  }
}

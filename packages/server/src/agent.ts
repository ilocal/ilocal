import { Agent, AgentOptions } from "http";
import net from "net";
import logger from "./logger";

export default class IlocalAgent extends Agent {
  server: net.Server;
  started: boolean = false;
  closed: boolean = false;

  private onClose() {
    this.closed = true;
  }
  private onConnection(socket: net.Socket) {
    socket
      .on("close", (hasError: boolean) => {})
      .on("error", (err: Error) => {
        socket.destroy();
      });
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

    this.started = false;
    this.closed = false;
  }

  // Agent 启用
  listen(): Promise<net.AddressInfo> {
    if (this.started) {
      const err = new Error("already started");
      logger.error(err);
      throw err;
    }
    this.server
      .on("close", this.onClose)
      .on("connection", this.onConnection)
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
          resolve({ address, family: "", port: 0 });
        } else if (address === null) {
          reject();
        } else {
          resolve(address);
        }
      });
    });
  }

  async connect(callback: (err: Error, socket?: net.Socket) => void) {
    if (this.closed) {
      callback(new Error("agent closed"));
      return;
    }
    // this.debug('create connection');
    // // socket is a tcp connection back to the user hosting the site
    // const sock = this.availableSockets.shift();
    // // no available sockets
    // // wait until we have one
    // if (!sock) {
    //     this.waitingCreateConn.push(cb);
    //     this.debug('waiting connected: %s', this.connectedSockets);
    //     this.debug('waiting available: %s', this.availableSockets.length);
    //     return;
    // }
    // this.debug('socket given');
    // cb(null, sock);
  }

  destroy() {
    this.server.close();
    super.destroy();
  }
}

import net from "net";
import http from "http";
import EventEmitter from "events";
import Local, { ILocalOptions } from "./local";
import logger from "./logger";

interface IRemoteOptions {
  // 服务器host
  host: string;
  // 服务器端口
  port: number;
}

interface IServerConfig {
  port: number;
}

export default class Remote extends EventEmitter {
  public connection: net.Socket = null;
  public option: IRemoteOptions;

  private onConnect(option: Partial<ILocalOptions> = {}) {
    const rConn = this.connection;
    logger.info("Remote successfully");

    // 暂停remote stream
    rConn.pause().once("close", this.onClose.bind(this));

    // 创建local连接
    const { connection: lConn } = new Local(this.id, option);
    lConn.once("connect", () => {
      logger.info("Local successfully");
      // 恢复remote 并将stream转向至local 然后返回给remote
      rConn.resume().pipe(lConn).pipe(rConn);

      lConn.once("close", () => {
        logger.info("Local closed");
      });
    });
  }
  private onClose() {
    logger.info("Remote connection closed");
    this.connection.end();
    this.emit("remote.close");
  }
  private onError() {
    logger.info("Remote connection error");
    this.connection.end();
  }
  private onData(data: Buffer) {
    logger.info(data.toString().split("\r\n")[0]);
  }

  constructor(private readonly id: string, option: Partial<IRemoteOptions> = {}) {
    super();
    this.option = Object.assign(
      {
        host: "ilocal.cc",
        port: 80,
      },
      option
    );
  }

  async pipe(option: Partial<ILocalOptions> = {}) {
    if (this.connection) {
      return this.connection;
    }
    const serverConfig = await this.getServer();

    return (this.connection = net
      .connect({
        host: `${this.id}.${this.option.host}`,
        port: serverConfig.port,
      })
      .setKeepAlive(true)
      .once("connect", () => {
        this.onConnect.call(this, option);
      })
      .once("error", this.onError.bind(this))
      .on("data", this.onData.bind(this)));
  }

  // 获取服务器端的配置信息
  private getServer(): Promise<IServerConfig> {
    const { host, port } = this.option;
    return new Promise((resolve, reject) => {
      http
        .get(
          {
            port,
            host,
            path: `/new?id=${this.id}`,
          },
          (res) => {
            var body = "";
            res.on("data", function (chunk) {
              body += chunk;
            });
            res.on("end", function () {
              resolve(JSON.parse(body));
            });
          }
        )
        .on("error", function (e) {
          reject(e);
        });
    });
  }
}

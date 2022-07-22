import EventEmitter from "events";
import net from "net";
export interface ILocalOptions {
  // 端口
  port: number;
  // 地址
  host: string;
}
export default class Local extends EventEmitter {
  public connection: net.Socket = null;
  public option: ILocalOptions;
  constructor(public readonly id: string, option: Partial<ILocalOptions> = {}) {
    super();
    this.option = Object.assign(
      {
        port: 80,
        host: undefined,
      },
      option
    );
    this.connection = net.connect(this.option);
  }
}

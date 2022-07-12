import http from "http";
import IlocalAgent from "./agent";

export default class Client {
  private agent: IlocalAgent;

  constructor(public clientId: string) {
    this.agent = new IlocalAgent({});
  }

  handleRequest(req, res) {
    const clientReq = http.request({
      ...req,
      agent: this.agent,
    });
    clientReq.once("error", (err) => {});
    // pump(req, clientReq);
  }

  // 销毁链接客户端
  destroy() {
    this.agent.destroy();
  }
}

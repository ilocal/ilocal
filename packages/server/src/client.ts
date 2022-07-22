import http from "http";
import IlocalAgent from "./agent";
import pump from "pump";
import internal from "stream";

export default class Client {
  private agent: IlocalAgent;

  constructor(public clientId: string) {
    this.agent = new IlocalAgent({});
    // this.agent.listen().then(console.log);
  }

  async listen() {
    return await this.agent.listen();
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    // console.log("request。。。", this.agent, req);
    const clientReq = http.request(
      {
        ...req,
        agent: this.agent,
      },
      (clientRes) => {
        console.log("aaaaaaaaaaaa");
        pump(clientRes, res);
      }
    );
    clientReq.on("error", (err) => {
      console.log("errr", err);
    });
    console.log("handleRequest");
    pump(req, clientReq);
  }

  handleUpgrade(req: http.IncomingMessage, socket: internal.Duplex) {
    // this.agent.createConnection((err, agentSocket) => {
    //   if (err) {
    //     socket.end();
    //   } else if (agentSocket) {
    //     pump(agentSocket, socket);
    //     pump(socket, agentSocket);
    //   }
    // });
  }

  // 销毁链接客户端
  destroy() {
    this.agent.destroy();
  }

  get port() {
    return this.agent?.port || 0;
  }
}

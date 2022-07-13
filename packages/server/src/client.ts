import http from "http";
import IlocalAgent from "./agent";
import pump from "pump";
import internal from "stream";

export default class Client {
  private agent: IlocalAgent;

  constructor(public clientId: string) {
    this.agent = new IlocalAgent({});
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const clientReq = http.request(
      {
        ...req,
        agent: this.agent,
      },
      (clientRes) => {
        pump(clientRes, res);
      }
    );
    pump(req, clientReq);
  }

  handleUpgrade(req: http.IncomingMessage, socket: internal.Duplex) {
    this.agent.connect((err, agentSocket) => {
      if (err) {
        socket.end();
      } else if (agentSocket) {
        pump(agentSocket, socket);
        pump(socket, agentSocket);
      }
    });
  }

  // 销毁链接客户端
  destroy() {
    this.agent.destroy();
  }
}

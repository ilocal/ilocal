import Client from "./client";

// 请求调度
export default class Manager {
  clients = new Map<string, Client>();

  getClient(id: string): Client {
    let client = this.clients.get(id);
    if (!client) {
      client = new Client(id);
      this.clients.set(id, client);
    }
    return client;
  }
}

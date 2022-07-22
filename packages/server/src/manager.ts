import Client from "./client";

// 请求调度
class Manager {
  clients = new Map<string, Client>();

  async getClient(id: string, autoCreate: boolean = true): Promise<Client> {
    let client = this.clients.get(id);
    if (!client && autoCreate) {
      client = new Client(id);
      this.clients.set(id, client);
      await client.listen();
    }
    return client;
  }
}
const manager = new Manager();
export default manager;

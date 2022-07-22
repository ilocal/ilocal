import express from "express";
import manager from "./manager";

interface INewClientReq {
  id: string;
}

const app = express();
// 新客户端接入
app.get<INewClientReq>("/new", async (req, res) => {
  const { query, hostname } = req;
  const { id } = query;
  const { port = 0 } = await manager.getClient(id.toString());
  res.json({ port, host: `${id}.${hostname}` });
});
app.get("/", (req, res) => {
  res.send("hello world!");
});
app.all("*", (_req, res) => {
  console.log("All done!");
  res.send(404);
});

export default app;

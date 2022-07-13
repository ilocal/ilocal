import express from "express";
import Manager from "./manager";

interface INewClientReq {
  id: string;
}

const app = express();
const manager = new Manager();
// 新客户端接入
app.get<INewClientReq>("/new", (req, res) => {
  const { id } = req.params;
  const client = manager.getClient(id);
});
app.get("/", (req, res) => {
  res.send("hello world!");
});

export default app;

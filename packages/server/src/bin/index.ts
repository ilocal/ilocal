#!/usr/bin/env node --experimental-modules --es-module-specifier-resolution=node
import { Server } from "../index";
const { server } = new Server();

server.listen(1024, () => {
  console.log("server listening:", 1024);
});

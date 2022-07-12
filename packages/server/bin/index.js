#!/usr/bin/env node --experimental-modules --es-module-specifier-resolution=node
import { Server } from "../dist/index";
const { server } = new Server();

server.listen(8000, () => {
  console.log("server listening:", 8000);
});

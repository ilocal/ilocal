#!/usr/bin/env node --experimental-modules --es-module-specifier-resolution=node
import { Remote } from "../index";
new Remote("test", {
  port: 1024,
}).pipe({
  port: 1000,
});

// const local = new Local("test", {
//   port: 3000,
//   host: "localhost",
// });

// local.connect();

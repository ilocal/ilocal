import { createServer, connect } from "net";

// const local = connect({
//   host: "localhost",
//   port: 3000,
// });

// local.on("connect", () => {
//   console.log(local);

//   const server = connect({
//     host: "localhost",
//     port: 1024,
//   });
//   local.pipe(server);
//   server.pipe(local);
// });

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;
console.log(process.argv);
var addr = {
  from: addrRegex.exec(process.argv[2]),
  to: addrRegex.exec(process.argv[3]),
};

if (!addr.from || !addr.to) {
  console.log("Usage: <from> <to>");
}

const server = createServer();

server.on("connection", (from) => {
  const to = connect({
    host: addr.to[2],
    port: addr.to[3],
  });
  from.pipe(to).pipe(from);
});

console.log(addr.from);
server.listen(addr.from[3], addr.from[2]);

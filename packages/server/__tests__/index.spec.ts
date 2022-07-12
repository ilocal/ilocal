import Server from "../src/server";

describe("server", () => {
  const server = new Server();

  it("close", () => {
    server.destroy();
  });
});

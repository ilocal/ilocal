import Server from "../src/index";

describe("server", () => {
  const server = new Server();

  it("close", () => {
    server.destroy();
  });
});

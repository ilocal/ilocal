import IlocalAgent from "../src/agent";

describe("agent", () => {
  const agent = new IlocalAgent();

  agent.listen().then(() => {
    agent.destroy();
  });

  it("should set test task", async () => {
    expect(1).toEqual(1);
  });
});

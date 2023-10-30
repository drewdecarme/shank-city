import { Command } from "commander";
import { startVitest } from "vitest/node";

export const commandTest = new Command("test").description(
  "Run the flare city testing module to execute integration tests"
);

async function test() {
  const vitest = await startVitest("test", undefined, {});

  await vitest?.close();
}

commandTest.action(test);

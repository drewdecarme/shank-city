import { beforeAll } from "vitest";
import { unstable_dev } from "wrangler";
import { resolve } from "path";

beforeAll(async () => {
  const currentDir = process.cwd();
  console.log("currentDir", currentDir);
  const workerPath = resolve(process.cwd(), "./src/index.ts");
  const worker = await unstable_dev(workerPath, {
    experimental: { disableExperimentalWarning: true },
  });
  global.worker = worker;

  return async () => {
    if (!global.worker) return;
    await global.worker.stop();
    delete global.worker;
  };
});

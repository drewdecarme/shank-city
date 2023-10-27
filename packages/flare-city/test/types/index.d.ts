import { UnstableDevWorker } from "wrangler";

declare global {
  var worker: UnstableDevWorker | undefined;
}

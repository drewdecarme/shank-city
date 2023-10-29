/* eslint-disable no-var */
import type { UnstableDevWorker } from "wrangler";

declare global {
  var worker: UnstableDevWorker | undefined;
}

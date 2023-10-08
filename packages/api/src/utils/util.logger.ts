import { WorkersLogger } from "@flare-kit/logger";

export const log = new WorkersLogger({
  name: "api",
  level: "debug",
});

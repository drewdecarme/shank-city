import { WorkersLogger } from "@flare-city/logger";

export const log = new WorkersLogger({
  name: "api",
  level: "debug",
});

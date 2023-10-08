import { WorkersLogger } from "@shank-city/logger";

export const log = new WorkersLogger({
  name: "api",
  level: "debug",
});

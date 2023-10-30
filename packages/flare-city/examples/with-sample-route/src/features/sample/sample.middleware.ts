import type { Middleware } from "@flare-city/core";
import { log } from "../../lib";

/**
 * Middleware to add the sample string to the execution
 * context of the request
 */
export const middlewareSample: Middleware = async (request, env, context) => {
  log.setName("Middleware:Sample");

  log.debug("Middleware: Creating Sample and adding to context...");
  context.sample = "sample";
  log.debug("Middleware: Creating Sample and adding to context... done.");
};

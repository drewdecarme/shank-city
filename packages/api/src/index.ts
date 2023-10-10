import { middlewarePrisma } from "./lib";
import { App } from "@flare-city/core";
import { RouteTest, RouteTeam } from "./features";
import { Env, log } from "../../flare-city/core/src/utils";

// Declare a new application
export const API = new App("shank-city");

// Add Middleware
API.addMiddleware(middlewarePrisma);

// Add routes
API.addRoute(RouteTest);
API.addRoute(RouteTeam);

export default {
  fetch: async function (
    request: Request,
    env: Env,
    context: ExecutionContext
  ) {
    console.log(JSON.stringify({ request, env, context }, null, 2));
    // set the log level
    log.setLogLevel(env.LOG_LEVEL || "debug");
    log.setLoggingType(env.LOG_TYPE || "json");

    // run the app
    return API.run(request, env, context);
  },
};

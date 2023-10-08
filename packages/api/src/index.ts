/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { App, middlewarePrisma } from "./lib";
import { RouteTest, RouteTeam } from "./features";
import { HandlerArgs } from "./lib/route/route.types";
import { log } from "./utils";

// Declare a new application
export const ShankCityApp = new App("shank-city");

// Add Middleware
ShankCityApp.addMiddleware(middlewarePrisma);

// Add routes
ShankCityApp.addRoute(RouteTest);
ShankCityApp.addRoute(RouteTeam);

export default {
  fetch: async function (...args: HandlerArgs) {
    // set the log level
    log.setLogLevel(args[1].LOG_LEVEL || "debug");
    log.setLoggingType(args[1].LOG_TYPE || "json");

    // run the app
    return ShankCityApp.run(...args);
  },
};

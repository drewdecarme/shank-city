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
import { RouteTest } from "./features";
import { HandlerArgs } from "./lib/route/route.types";

// Declare a new application
export const ShankCityApp = new App("shank-city");

// Add Middleware
ShankCityApp.addMiddleware(middlewarePrisma);

// Add routes
ShankCityApp.addRoute(RouteTest);

export default {
  fetch: async function (...args: HandlerArgs) {
    return ShankCityApp.run(...args);
  },
};

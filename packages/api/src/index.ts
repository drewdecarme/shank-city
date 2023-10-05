/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Handler, NotFoundError, RouteDefinition, errorHandler } from "./utils";
import * as routes from "./features";

const fetch: Handler = async (request, env, ctx) => {
  const { pathname } = new URL(request.url);

  // Reduce over the routes to find a route
  // that matches the beginning of the pathname
  const route = Object.entries(
    routes as Record<string, RouteDefinition>
  ).reduce<RouteDefinition | undefined>((accum, [, routeDef]) => {
    if (pathname.startsWith(routeDef.namespace)) return routeDef;
    return accum;
  }, undefined);

  try {
    // If there isn't a route that matches the
    // pathname, then throw an error
    if (typeof route === "undefined") {
      throw new NotFoundError("The route does not exist.");
    }

    // Run the handler
    return route.handler(request, env, ctx);
  } catch (error) {
    return errorHandler(error);
  }
};

export default { fetch };

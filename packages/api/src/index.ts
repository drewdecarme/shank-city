/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {
  Env,
  Handler,
  NotFoundError,
  RouteDefinition,
  UnauthorizedError,
} from "./utils";
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
    // if the error is handled then just throw the error
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      return new Response(
        JSON.stringify({
          message: error.message,
          status_code: error.status_code,
          status_text: error.status_text,
        }),
        {
          status: error.status_code,
          statusText: error.status_text,
        }
      );
    }
    // if it's unhandled then throw an unhandled error.
    throw new Error("Internal Server Error: Unhandled.");
  }
};

export default { fetch };

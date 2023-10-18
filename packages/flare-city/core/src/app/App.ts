import {
  Env,
  ErrorNotFound,
  HandlerArgs,
  Middleware,
  errorHandler,
  log,
} from "../utils";
import type { Route } from "../route/Route";
import { LogLevel, LoggingType } from "@flare-city/logger";

export class App {
  name: string;
  routes: Route[];
  middlewares: Middleware[];

  constructor(name: string) {
    this.name = name;
    this.routes = [];
    this.middlewares = [];
  }

  addRoute(route: Route) {
    this.routes.push(route);
  }

  addMiddleware(fn: Middleware) {
    this.middlewares.push(fn);
  }

  private async runMiddlewares(...args: HandlerArgs) {
    try {
      for await (const middlewareFn of this.middlewares) {
        await middlewareFn(...args);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  run(
    request: Request,
    env: Env,
    context: ExecutionContext,
    options?: { logLevel: LogLevel; logType: LoggingType }
  ) {
    const { pathname } = new URL(request.url);

    // set logging based upon some options
    log.setLogLevel(options?.logLevel || "debug");
    log.setLoggingType(options?.logType || "json");

    const route = this.routes.reduce<Route | undefined>((accum, routeDef) => {
      if (pathname.startsWith(routeDef.root)) return routeDef;
      return accum;
    }, undefined);

    try {
      // If there isn't a route that matches the
      // pathname, then throw an error
      if (typeof route === "undefined") {
        throw new ErrorNotFound(
          "The route does not exist: https://www.youtube.com/watch?v=oDAKKQuBtDo"
        );
      }

      // Run middlewares
      this.runMiddlewares(request, env, context);

      // Run the handler
      const response = route.run(request, env, context);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  }
}

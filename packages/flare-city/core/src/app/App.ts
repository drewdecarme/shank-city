import type { Env, HandlerArgs, Middleware } from "../utils";
import { ErrorNotFound, errorHandler, log } from "../utils";
import type { Route } from "../route/Route";
import type { LogLevel, LoggingType } from "@flare-city/logger";

export type RunOptions = { logLevel: LogLevel; logType: LoggingType };

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

  start(): { fetch: (...args: HandlerArgs) => Promise<Response | undefined> } {
    return {
      fetch: async (request: Request, env: Env, context: ExecutionContext) => {
        const logLevel = env.LOG_LEVEL || "debug";
        const logType = env.LOG_TYPE || "json";
        // set the log level
        log.setLogLevel(logLevel);
        log.setLoggingType(logType);

        // run the app
        return this.run(request, env, context, { logLevel, logType });
      },
    };
  }

  async run(
    request: Request,
    env: Env,
    context: ExecutionContext,
    options?: RunOptions
  ) {
    const { pathname } = new URL(request.url);

    // set logging based upon some options
    log.setLogLevel(options?.logLevel || "debug");
    log.setLoggingType(options?.logType || "json");
    log.setName("FlareCity");

    log.info("Matching base route...");
    const route = this.routes.reduce<Route | undefined>((accum, routeDef) => {
      log.debug(
        `Path: ${pathname} | RouteRoot: ${
          routeDef.root
        } | Match? ${pathname.startsWith(routeDef.root)}`
      );
      if (pathname.startsWith(routeDef.root)) {
        return routeDef;
      }
      return accum;
    }, undefined);
    log.info("Matching base route... done");

    try {
      // If there isn't a route that matches the
      // pathname, then throw an error
      if (typeof route === "undefined") {
        throw new ErrorNotFound("The route does not exist");
      }

      // Run middlewares
      log.info("Running app level middleware...");
      await this.runMiddlewares(request, env, context);
      log.info("Running app level middleware... done");

      // Run the handler
      log.info("Executing route...");
      const response = await route.run(request, env, context);
      log.info("Executing route... done.");
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  }
}

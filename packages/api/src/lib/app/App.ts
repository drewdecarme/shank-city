import { middleware } from "supertokens-node/lib/build/framework/express";
import { Env, ErrorNotFound, errorHandler } from "../../utils";
import { CFRoute } from "../route/Route";
import { HandlerArgs } from "../route/route.types";

export type Middleware = (...args: HandlerArgs) => Promise<void>;

export class App {
  name: string;
  routes: CFRoute[];
  middlewares: Middleware[];

  constructor(name: string) {
    this.name = name;
    this.routes = [];
    this.middlewares = [];
  }

  addRoute(route: CFRoute) {
    this.routes.push(route);
  }

  addMiddleware(fn: Middleware) {
    this.middlewares.push(fn);
  }

  private async runMiddlewares(...args: HandlerArgs) {
    for await (const middlewareFn of this.middlewares) {
      await middlewareFn(...args);
    }
  }

  run(request: Request, env: Env, context: ExecutionContext) {
    const { pathname } = new URL(request.url);

    const route = this.routes.reduce<CFRoute | undefined>((accum, routeDef) => {
      if (pathname.startsWith(routeDef.basePath)) return routeDef;
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

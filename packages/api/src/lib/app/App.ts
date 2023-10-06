import { Env, ErrorNotFound, errorHandler } from "../../utils";
import { CFRoute } from "../route/Route";

export class App {
  name: string;
  routes: CFRoute[];

  constructor(name: string) {
    this.name = name;
    this.routes = [];
  }

  addRoute(route: CFRoute) {
    this.routes.push(route);
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

      // Run the handler
      const response = route.run(request, env, context);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  }
}

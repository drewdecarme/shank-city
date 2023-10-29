import type {
  Env,
  ApiResponse,
  RequestURLSegments,
  RequestURLSearchParams,
} from "../utils";
import { ErrorNotFound, errorHandler, ErrorServer } from "../utils";
import { log, createMiddlewareValidate } from "../utils";
import type {
  RouteGET,
  RouteHandlerResponse,
  RouteMatch,
  RouteMethods,
  RoutePOST,
} from "./route.types";

interface RouteConstructorParams {
  root: string;
}

export class Route implements RouteConstructorParams {
  root: string;
  private requests: { GET: RouteGET[]; POST: RoutePOST[] };
  private matchedRoute: RouteMatch | undefined;

  constructor(params: RouteConstructorParams) {
    this.root = params.root;
    this.requests = {
      GET: [],
      POST: [],
    };
    this.matchedRoute = undefined;
  }

  /**
   * A simpler handler that formats a response. This is
   * passed in as the 4th parameter to any route handler
   */
  private static response: RouteHandlerResponse<Record<string, unknown>> =
    async ({ json, status = 200 }) =>
      new Response(JSON.stringify(json), { status });

  get<
    R extends ApiResponse<unknown>,
    S extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  >(params: RouteGET<R, S, P>) {
    /**
     * RATIONALE: Don't really care about the internal
     * types of this... all we care is that it get's stored
     * in the requests.get array and then can be parsed appropriately
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.requests.GET.push(params);
  }

  post<
    R extends ApiResponse<unknown>,
    B extends Record<string, unknown>,
    S extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  >(params: RoutePOST<R, B, S, P>) {
    /**
     * RATIONALE: Don't really care about the internal
     * types of this... all we care is that it get's stored
     * in the requests.get array and then can be parsed appropriately
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.requests.POST.push(params);
  }

  private matchAndParseRouteRequest(
    request: Request,
    routePath: string
  ):
    | {
        isMatch: false;
        pattern: undefined;
      }
    | {
        isMatch: true;
        pattern: URLPatternURLPatternResult;
      } {
    const requestURL = new URL(request.url).toString();
    const fullRoutePath = `${this.root}${routePath}`;
    const pattern = new URLPattern({ pathname: fullRoutePath });
    const patternMatch = pattern.test(requestURL);
    log.debug(`Matching route path: '${routePath}: ${patternMatch}'`, {
      requestURL,
      routePath,
      patternMatch,
    });
    if (!patternMatch) {
      return {
        isMatch: false,
        pattern: undefined,
      };
    }
    const parsedPattern = pattern.exec(requestURL);
    if (!parsedPattern) {
      throw new ErrorServer("Unable to parse properties from route request.");
    }

    return {
      isMatch: true,
      pattern: parsedPattern,
    };
  }

  /**
   * Given a request, this method loops through
   * all of the stored requests on this route instance
   * and finds the route that matches the URL request pattern.
   * If the request.url doesn't match any of the route path
   * definitions, it will throw a ErrorNotFound error.
   */
  private matchRouteWithRequest(request: Request) {
    log.info("Matching request method & pathname with `route.url` pattern...");
    const method = request.method.toUpperCase() as RouteMethods;
    const routes = this.requests[method];
    if (!routes) {
      throw new ErrorNotFound(
        `The HTTP request method "${method}" is not supported.`
      );
    }

    const matchedRoute = routes.reduce<RouteMatch | undefined>(
      (accum, routeDef) => {
        const urlPatternMatch = this.matchAndParseRouteRequest(
          request,
          routeDef.path
        );
        if (urlPatternMatch.isMatch) {
          return { route: routeDef, pattern: urlPatternMatch.pattern };
        }
        return accum;
      },
      undefined
    );
    if (!matchedRoute) {
      throw new ErrorNotFound("The route does not exist");
    }
    this.matchedRoute = matchedRoute;
    log.info("Matching request pathname with `route.url` pattern... done.");
  }

  /**
   * Provided the arguments of the worker
   * this method checks to see if there is any middleware that
   * was defined when the Route was instantiated.
   *
   * If there is
   * it will run through the middleware sequentially, waiting
   * for the previous middleware to complete before continuing on.
   *
   * If there is no middleware defined on the route, this method
   * will return, exiting as early as possible.
   *
   * **NOTE**: Be sure to `await` this when running it so all
   * middlewares run before the route handler does
   */
  private async runMiddleware(
    request: Request,
    env: Env,
    context: ExecutionContext
  ) {
    if (!this.matchedRoute) return;
    if (!this.matchedRoute.route.middleware) {
      log.debug("No middleware to run. Bypassing middleware runner.");
      return;
    }
    log.info("Running route level middleware...");

    // destructure `middleware` and `parse` out of the route
    // definition to make it easier to use
    const { parse, middleware } = this.matchedRoute.route;

    // Add segment validation to middleware array if available.
    if (parse?.segments) {
      context.segments = this.matchedRoute.pattern.pathname.groups;
      const segmentMiddleware = createMiddlewareValidate({
        name: "segments",
        schema: parse.segments,
        contextKey: "segments",
      });
      middleware.push(segmentMiddleware);
    }

    // Add param validation to middleware array if available
    if (parse?.params) {
      const searchEntries = new URLSearchParams(
        this.matchedRoute.pattern.search.input
      ).entries();
      const searchParams = Object.fromEntries(searchEntries);
      context.params = searchParams;
      const paramsMiddleware = createMiddlewareValidate({
        name: "params",
        schema: parse.params,
        contextKey: "params",
      });
      middleware.push(paramsMiddleware);
    }

    // Run middlewares one at a time
    for await (const middlewareFn of middleware) {
      await middlewareFn(request, env, context);
    }
    log.info("Running route level middleware... done");
  }

  /**
   * This method is a public method that is exposed to allow the app
   * to run the routes
   */
  async run(request: Request, env: Env, context: ExecutionContext) {
    try {
      // Match the route with the request URL
      this.matchRouteWithRequest(request);

      // Run any middlewares if they exist
      await this.runMiddleware(request, env, context);

      // this should never happen... this is just to appease TS
      if (!this.matchedRoute) return;

      // Return instantiated route.handler
      return this.matchedRoute.route.handler(
        request,
        env,
        context,
        Route.response
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}

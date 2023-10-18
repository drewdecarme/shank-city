import {
  Env,
  ErrorNotFound,
  errorHandler,
  ApiResponse,
  RequestURLSegments,
  ErrorServer,
  Middleware,
  RequestURLSearchParams,
} from "../utils";
import { log } from "../utils";
import {
  ValidateParamsArgs,
  ValidateSegmentsArgs,
  validateParams,
  validateSegments,
} from "../validate";

interface RouteConstructorParams {
  root: string;
}

export type RouteHandlerResponse<T extends Record<string, unknown>> = (
  params: { json: T } & { status?: 200 | 301 }
) => Promise<Response>;

type RouteMethod = "GET" | "POST";
type RouteHandler<
  T extends Record<string, unknown>,
  P extends RequestURLSearchParams = RequestURLSearchParams,
  S extends RequestURLSegments = RequestURLSegments,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P>,
  res: RouteHandlerResponse<T>
) => Promise<Response>;

export type RouteDefinition<
  T extends Record<string, unknown> = Record<string, unknown>,
  P extends RequestURLSearchParams = RequestURLSearchParams,
  S extends RequestURLSegments = RequestURLSegments,
> = {
  path: string;
  method: RouteMethod;
  middleware?: Middleware[];
  /**
   * A special kind of structured middleware that utilizes
   * helper functions to validate specific attributes on
   * the request. If the properties are defined, these will
   * always run __after__ the defined `route.middleware` above and
   * __before__ the `route.handler`
   */
  validate?: {
    /**
     * ### URL Segments
     * Validation object that can be customized
     * with a error message
     * @example /test/:segment
     */
    segments?: ValidateSegmentsArgs<S>;
    params?: ValidateParamsArgs<P>;
  };
  handler: RouteHandler<T, P, S>;
};

export type MatchedRoute = {
  route: RouteDefinition;
  pattern: URLPatternURLPatternResult;
};

export class Route implements RouteConstructorParams {
  root: string;
  private requests: RouteDefinition[];
  private matchedRoute: MatchedRoute | undefined;

  constructor(params: RouteConstructorParams) {
    this.root = params.root;
    this.requests = [];
    this.matchedRoute = undefined;
  }

  /**
   * A simpler handler that formats a response. This is
   * passed in as the 4th parameter to any route handler
   */
  private static response: RouteHandlerResponse<Record<string, unknown>> =
    async ({ json, status = 200 }) =>
      new Response(JSON.stringify(json), { status });

  register<
    T extends ApiResponse<unknown>,
    P extends RequestURLSearchParams = RequestURLSearchParams,
    S extends RequestURLSegments = RequestURLSegments,
  >(params: RouteDefinition<T, P, S>) {
    /**
     * RATIONALE: Don't really care about the internal
     * types of this... all we care is that it get's stored
     * in the requests array and then can be parsed appropriately
     */
    // @ts-ignore
    this.requests.push(params);
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
      throw new ErrorServer("Unable to parse segments from matched route");
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
    try {
      const matchedRoute = this.requests.reduce<MatchedRoute | undefined>(
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
      if (!matchedRoute) throw new ErrorNotFound("The route does not exist");
      this.matchedRoute = matchedRoute;
    } catch (error) {
      errorHandler(error);
    }
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
    log.debug("Running route level middleware...");

    // destructure middleware and validate out of the route
    // definition to make it easier to use
    const { validate, middleware } = this.matchedRoute.route;

    // Add segment validation to middleware array if available.
    if (validate?.segments) {
      const segmentMiddleware = validateSegments(validate.segments)(
        this.matchedRoute
      );
      middleware.push(segmentMiddleware);
    }

    // Add param validation to middleware array if available
    if (validate?.params) {
      const paramsMiddleware = validateParams(validate.params)(
        this.matchedRoute
      );
      middleware.push(paramsMiddleware);
    }

    for await (const middlewareFn of middleware) {
      try {
        await middlewareFn(request, env, context);
      } catch (error) {
        throw error;
      }
    }
    log.debug("Running route level middleware... done");
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
      console.log(error);
      return errorHandler(error);
    }
  }
}

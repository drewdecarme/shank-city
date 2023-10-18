import { ZodError, z } from "zod";
import {
  Env,
  ErrorValidation,
  ErrorNotFound,
  errorHandler,
  ApiResponse,
  RequestURLSegments,
  ErrorServer,
  Middleware,
  RequestURLSearchParams,
} from "../utils";
import { log } from "../utils";

interface RouteConstructorParams {
  basePath: string;
  authenticate?: boolean;
}

export type RouteHandlerResponse<T extends Record<string, unknown>> = (
  params: { json: T } & { status?: 200 | 301 }
) => Promise<Response>;

type RouteMethod = "GET" | "POST";
type RouteHandler<
  T extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S>,
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
  validate?: {
    /**
     * ### URL Segments
     * Validation object that can be customized
     * with a error message
     * @example /test/:segment
     */
    segments?: { [key in keyof S]: string | null };
    /**
     * ### URLSearchParams
     * Validation object that can validate
     * the format of the param as well as how
     * it should be parsed
     */
    params?: {
      [key in keyof P]: {
        type: "number" | "string" | "date";
        format?: (value: string) => string | true;
      };
    };
  };
  handler: RouteHandler<T, S>;
};

type MatchedRoute = {
  route: RouteDefinition;
  pattern: URLPatternURLPatternResult;
};

export class Route implements RouteConstructorParams {
  basePath: string;
  requests: RouteDefinition[];
  matchedRoute: MatchedRoute | undefined;

  constructor(params: RouteConstructorParams) {
    this.basePath = params.basePath;
    this.requests = [];
    this.matchedRoute = undefined;
  }

  /**
   * A simpler handler that formats a response. This is
   * passed in as the 4th parameter to any route handler
   */
  static response: RouteHandlerResponse<Record<string, unknown>> = async ({
    json,
    status = 200,
  }) => new Response(JSON.stringify(json), { status });

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
    const fullRoutePath = `${this.basePath}${routePath}`;
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
   * This method enriches the execution context with
   * the search params that are gathered from the request
   */
  private validateRequestSearchParamsAndEnrichContext(
    request: Request,
    context: ExecutionContext
  ) {
    if (!this.matchedRoute) return;
    if (!request.url.includes("?")) return;

    const { route, pattern } = this.matchedRoute;
    const parsedSearchParams = pattern.search.groups;
  }

  /**
   * Given a route and a Request, this method
   */
  private validateRequestSegmentsAndEnrichContext(
    request: Request,
    context: ExecutionContext
  ) {
    // exit early if the matched route isn't there.
    if (!this.matchedRoute) return;
    const { route, pattern } = this.matchedRoute;
    const parsedSegments = pattern.pathname.groups;

    // If no segments are defined, exit early
    if (!route.path.includes(":")) {
      log.debug("Route does not have any segments");
      return;
    }

    if (!parsedSegments) {
      throw new ErrorServer(
        "Error when trying to parse the segments from the request URL."
      );
    }

    // If there is no validation, set segments
    // on the context and exit early
    if (!route.validate?.segments) {
      log.debug("No segment validation required on `route.validate.segments`");
      context.segments = parsedSegments;
      return;
    }

    // Construct a zod schema to validate the parsedSegments
    const segmentSchema = z.object(
      Object.entries(route.validate.segments).reduce(
        (accum, [segmentProperty, segmentErrorMessage]) => {
          return {
            ...accum,
            [segmentProperty]: z.string({
              required_error:
                segmentErrorMessage ??
                `Missing ':${segmentProperty}' segment in the request URL.`,
            }),
          };
        },
        {}
      )
    );

    // Parse the segments against the schema
    // and set the validated parsed segments to the
    // `context.segments`
    try {
      segmentSchema.parse(parsedSegments);
      context.segments = parsedSegments;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ErrorValidation({
          message: `Failed to validate URL segments`,
          data: error.issues.reduce(
            (accum, issue) => ({
              ...accum,
              [issue.path.join(".")]: issue.message,
            }),
            {}
          ),
        });
      }
    }
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
   * Provided a route and the arguments of the worker
   * this method checks to see if there is any middleware that
   * was defined when the Route was instantiated. If there is
   * it will run through the middleware sequentially, waiting
   * for the previous middleware to complete before continuing on.
   * If there is no middleware defined on the route, this method
   * will return, exiting as early as possible.
   *
   * Be sure to `await` this when running it so all
   * middlewares run before the route handler does
   */
  private async executeRouteMiddleware(
    request: Request,
    env: Env,
    context: ExecutionContext
  ) {
    if (!this.matchedRoute) return;
    if (!this.matchedRoute.route.middleware) {
      log.debug("No middleware to run. Bypassing middleware runner.");
      return;
    }
    try {
      for await (const middlewareFn of this.matchedRoute.route.middleware) {
        await middlewareFn(request, env, context);
      }
    } catch (error) {
      errorHandler(error);
    }
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
      await this.executeRouteMiddleware(request, env, context);

      // Enrich / validate the request against the route definitions
      // this.validateRequestMethod(route, request);
      this.validateRequestSegmentsAndEnrichContext(request, context);
      this.validateRequestSearchParamsAndEnrichContext(request, context);

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

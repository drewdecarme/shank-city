import { ZodError, z } from "zod";
import {
  Env,
  ErrorValidation,
  ErrorNotFound,
  errorHandler,
  ApiResponse,
  RequestURLSegments,
  ErrorServer,
} from "../utils";
import { Middleware } from "../app";
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
  S extends RequestURLSegments = RequestURLSegments,
> = {
  path: string;
  method: RouteMethod;
  middleware?: Middleware[];
  validate?: {
    segments?: { [key in keyof S]: string | null };
  };
  handler: RouteHandler<T, S>;
};

export class Route implements RouteConstructorParams {
  basePath: string;
  requests: RouteDefinition[];

  constructor(params: RouteConstructorParams) {
    this.basePath = params.basePath;
    this.requests = [];
  }

  register<
    T extends ApiResponse<unknown>,
    S extends RequestURLSegments = RequestURLSegments,
  >(params: RouteDefinition<T, S>) {
    /**
     * RATIONALE: Don't really care about the internal
     * types of this... all we care is that it get's stored
     * in the requests array and then can be parsed appropriately
     */
    // @ts-ignore
    this.requests.push(params);
  }

  private fullRouteUrl(routePath: string) {
    return;
  }

  private matchRequestWithRoute(
    request: Request,
    routePath: string
  ):
    | {
        isMatch: false;
        segments: undefined;
      }
    | {
        isMatch: true;
        segments: Record<string, string>;
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
        segments: undefined,
      };
    }
    const parsedPattern = pattern.exec(requestURL);
    if (!parsedPattern) {
      throw new ErrorServer("Unable to parse segments from matched route");
    }

    return {
      isMatch: true,
      segments: parsedPattern.pathname.groups,
    };
  }

  private validateRequestSegments(
    route: RouteDefinition,
    request: Request,
    context: ExecutionContext
  ) {
    // If no segments are defined, exit early
    if (!route.path.includes(":")) return;

    const urlPatternMatch = this.matchRequestWithRoute(request, route.path);

    if (!urlPatternMatch.isMatch) return;
    const parsedSegments = urlPatternMatch.segments;

    if (!parsedSegments) {
      throw new ErrorServer(
        "Error when trying to parse the segments from the request URL."
      );
    }

    // If there is no validation, set segments to context
    // and exit early.
    if (!route.validate?.segments) {
      context.segments = parsedSegments;
      return;
    }

    // Construct a zod schema to validate the parsedSegments
    const segmentSchemaDef = Object.entries(route.validate.segments).reduce(
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
    );
    const segmentSchema = z.object(segmentSchemaDef);

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

  async run(request: Request, env: Env, context: ExecutionContext) {
    // create a response handler
    const res: RouteHandlerResponse<Record<string, unknown>> = async ({
      json,
      status = 200,
    }) => new Response(JSON.stringify(json), { status });

    // Match the route with the request URL
    const route = this.requests.reduce<RouteDefinition | undefined>(
      (accum, routeDef) => {
        const urlPatternMatch = this.matchRequestWithRoute(
          request,
          routeDef.path
        );
        if (urlPatternMatch.isMatch) {
          return routeDef;
        }
        return accum;
      },
      undefined
    );

    try {
      // check if the route exists
      if (!route) {
        throw new ErrorNotFound("The route does not exist");
      }

      // Run any middlewares if they exist
      if (typeof route.middleware !== "undefined") {
        try {
          for await (const middlewareFn of route.middleware) {
            await middlewareFn(request, env, context);
          }
        } catch (error) {
          errorHandler(error);
        }
      }

      // validate segment completeness
      this.validateRequestSegments(route, request, context);

      // Run the handler
      return route.handler(request, env, context, res);
    } catch (error) {
      return errorHandler(error);
    }
  }
}

import type { ZodType } from "zod";
import type {
  RequestURLSearchParams,
  RequestURLSegments,
  Middleware,
  Env,
  ApiResponse,
} from "../utils";

export type RouteHandlerResponse<T extends Record<string, unknown>> = (
  params: { json: T } & { status?: 200 | 301 }
) => Promise<Response>;

export type RouteMethods = "GET" | "POST";

/**
 * the GET Route definition
 */
export type RouteGET<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  method: Extract<RouteMethods, "GET">;
  middleware?: Middleware[];
  parse?: {
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: (
    request: Request,
    env: Env,
    ctx: ExecutionContext<S, P>,
    res: RouteHandlerResponse<R>
  ) => Promise<Response>;
};

/**
 * the POST route definition
 */
export type RoutePOST<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  method: Extract<RouteMethods, "GET">;
  middleware?: Middleware[];
  parse?: {
    body: ZodType<B>;
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: RoutePOSTHandler<R, B, S, P>;
};

export type RoutePOSTHandler<
  R extends Record<string, unknown> = Record<string, unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P, B>,
  res: RouteHandlerResponse<R>
) => Promise<Response>;

export type RouteDefinition = RouteGET | RoutePOST;

export type RouteMatch = {
  route: RouteDefinition;
  pattern: URLPatternURLPatternResult;
};

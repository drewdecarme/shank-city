import type { Env } from "./util.env";

export type ApiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

export type RequestURLSegments = Record<string, string>;
export type RequestURLSearchParams = Record<string, string | number | boolean>;

export type Middleware = <
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
  B extends Record<string, unknown> = Record<string, unknown>,
>(
  request: Request,
  env: Env,
  context: ExecutionContext<S, P, B>
) => Promise<void>;

export type HandlerArgs<
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
  B extends Record<string, unknown> = Record<string, unknown>,
> = [Request, Env, ExecutionContext<S, P, B>];

export type RequestMethods = "POST" | "PUT" | "GET" | "DELETE";

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
    B extends Record<string, unknown> = Record<string, unknown>,
  > {
    segments: T;
    params: P;
    body: B;
  }
}

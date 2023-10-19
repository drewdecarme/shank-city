import { MatchedRoute } from "../route";
import { Env } from "./util.env";

export type ApiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

export type RequestURLSegments = Record<string, string>;
export type RequestURLSearchParams = Record<string, string | number | boolean>;

export type Middleware = <
  S extends RequestURLSegments,
  P extends RequestURLSearchParams,
>(
  request: Request,
  env: Env,
  context: ExecutionContext<S, P>
) => Promise<void>;

export type HandlerArgs<
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = [Request, Env, ExecutionContext<S, P>];

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  > {
    segments: T;
    params: P;
  }
}

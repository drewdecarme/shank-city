import { Env } from "./util.env";

export type ApiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

export type RequestURLSegments = Record<string, string>;
export type RequestURLSearchParams = Record<string, string>;

export type Middleware = (...args: HandlerArgs) => Promise<void>;

export type HandlerArgs<T extends RequestURLSegments = RequestURLSegments> = [
  Request,
  Env,
  ExecutionContext<T>,
];

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  > {
    segments: T | undefined;
    params: P | undefined;
  }
}

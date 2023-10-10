import { Env } from "./util.env";

export type ApiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

export type RequestURLSegments = Record<string, string>;

export type HandlerArgs<T extends RequestURLSegments = RequestURLSegments> = [
  Request,
  Env,
  ExecutionContext<T>,
];

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
  > {
    segments: T | undefined;
  }
}

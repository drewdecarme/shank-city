import type {
  RequestURLSearchParams,
  RequestURLSegments,
} from "@flare-city/core";

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  > {
    segments: T;
    params: P;
    sample: string;
  }
}

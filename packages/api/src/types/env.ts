import { User } from "@prisma/client";
import { createPrismaClient } from "../lib";
import { RequestURLSearchParams, RequestURLSegments } from "@flare-city/core";

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  > {
    segments: T;
    params: P;
    prisma: ReturnType<typeof createPrismaClient>;
    auth:
      | { authenticated: false }
      | {
          authenticated: true;
          user: User;
        };
  }
}

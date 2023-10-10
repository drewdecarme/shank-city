import { User } from "@prisma/client";
import { createPrismaClient } from "../lib";
import { RequestURLSegments } from "@flare-city/core";

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
  > {
    segments: T | undefined;
    prisma: ReturnType<typeof createPrismaClient>;
    auth:
      | { authenticated: false }
      | {
          authenticated: true;
          user: User;
        };
  }
}

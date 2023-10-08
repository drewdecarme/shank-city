import { Env } from "../../utils";
import { createPrismaClient } from "../prisma";
import { User } from "@prisma/client";

export type ApiRequestSegments = Record<string, string>;

export type HandlerArgs<T extends ApiRequestSegments = ApiRequestSegments> = [
  Request,
  Env,
  ExecutionContext<T>,
];

type WithAuthentication<T extends Record<string, unknown>> = T &
  ({ authenticated: false } | { authenticated: true });

declare global {
  interface ExecutionContext<
    T extends ApiRequestSegments = ApiRequestSegments,
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

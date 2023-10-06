import { Env } from "../../utils";
import { createPrismaClient } from "../prisma";

export type ApiRequestSegments = Record<string, string>;

export type HandlerArgs<T extends ApiRequestSegments = ApiRequestSegments> = [
  Request,
  Env,
  ExecutionContext<T>,
];

declare global {
  interface ExecutionContext<
    T extends ApiRequestSegments = ApiRequestSegments,
  > {
    segments: T | undefined;
    prisma: ReturnType<typeof createPrismaClient>;
    user: { id: number } | undefined;
  }
}

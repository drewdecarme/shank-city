import { Middleware } from "@flare-city/core";
import { createPrismaClient } from "./createPrismaClient";
import { log } from "../logger";

/**
 * Middleware to add the Prisma client to the execution
 * context of the request
 */
export const middlewarePrisma: Middleware = async (request, env, context) => {
  log.setName("Middleware:Prisma");

  log.info("Middleware: Creating PrismaClient and adding to context...");
  const prisma = createPrismaClient(env.HYPERDRIVE.connectionString);
  context.prisma = prisma;
  log.info("Middleware: Creating PrismaClient and adding to context... done.");
};

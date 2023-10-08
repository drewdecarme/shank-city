import { log } from "../../utils";
import { Middleware } from "../app";
import { createPrismaClient } from "./createPrismaClient";

/**
 * Middleware to add the Prisma client to the execution
 * context of the request
 */
export const middlewarePrisma: Middleware = async (request, env, context) => {
  log.setName("Middleware:Prisma");
  log.debug("Middleware: Creating PrismaClient and adding to context...");
  const prisma = createPrismaClient(env.DATABASE_URL);
  context.prisma = prisma;
  log.debug("Middleware: Creating PrismaClient and adding to context... done.");
};

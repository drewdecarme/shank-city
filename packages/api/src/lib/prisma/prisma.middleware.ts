import { Middleware } from "../app";
import { createPrismaClient } from "./createPrismaClient";

/**
 * Middleware to add the Prisma client to the execution
 * context of the request
 */
export const middlewarePrisma: Middleware = async (request, env, context) => {
  console.log("Middleware: Creating PrismaClient and adding to context...");
  console.log(env);
  const prisma = createPrismaClient(env.DATABASE_URL);
  context.prisma = prisma;
  console.log(
    "Middleware: Creating PrismaClient and adding to context... done."
  );
};

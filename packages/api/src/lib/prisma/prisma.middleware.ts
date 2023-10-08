import { log } from "../../utils";
import { Middleware } from "../app";
import { createPrismaClient } from "./createPrismaClient";

/**
 * Middleware to add the Prisma client to the execution
 * context of the request
 */
export const middlewarePrisma: Middleware = async (request, env, context) => {
  log.setName("Middleware:Prisma");
  console.log(typeof env.HYPERDRIVE);
  log.debug(
    `Middleware: Hyperdrive status: "${
      typeof env.HYPERDRIVE === "undefined"
        ? "undefined"
        : env.HYPERDRIVE.connectionString
    }"`,
    {}
  );
  log.info("Middleware: Creating PrismaClient and adding to context...");
  const prisma = createPrismaClient(env.DATABASE_URL);
  context.prisma = prisma;
  log.info("Middleware: Creating PrismaClient and adding to context... done.");
};

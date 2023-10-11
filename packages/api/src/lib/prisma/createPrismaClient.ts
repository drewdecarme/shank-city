import { Env } from "@flare-city/core";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * Keeping this commented out until
 * https://github.com/prisma/prisma/issues/19488
 * is fixed.
 */
// export const createPrismaClient = (env: Env) => {
//   return new PrismaClient({
//     datasourceUrl: env.HYPERDRIVE.connectionString
//   });
// };

export const createPrismaClient = (env: Env) => {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log: [
      {
        emit: "stdout",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  }).$extends(withAccelerate());
};

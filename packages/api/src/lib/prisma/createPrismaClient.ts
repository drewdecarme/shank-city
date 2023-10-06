import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const createPrismaClient = (databaseConnectionString: string) => {
  return new PrismaClient({
    datasourceUrl: databaseConnectionString,
  }).$extends(withAccelerate());
};

import { PrismaClient } from "@prisma/client";

export const createPrismaClient = (databaseConnectionString: string) => {
  return new PrismaClient({
    datasourceUrl: databaseConnectionString,
  });
};

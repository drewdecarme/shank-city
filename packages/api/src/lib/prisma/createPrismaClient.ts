import { PrismaClient } from "@prisma/client/edge";

export const createPrismaClient = (databaseConnectionString: string) => {
  return new PrismaClient({
    datasourceUrl: databaseConnectionString,
  });
};

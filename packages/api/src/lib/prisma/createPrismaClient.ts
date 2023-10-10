import { PrismaClient } from "@prisma/client/edge";

export const createPrismaClient = (datasourceUrl: string) => {
  return new PrismaClient({ datasourceUrl });
};

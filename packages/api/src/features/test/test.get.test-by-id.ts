import type { ApiResponse } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";
import { z } from "zod";

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
const GetSingleTestApiSegmentsSchema = z.object({
  id: z.string(),
  test: z.string(),
});
export type GetSingleTestApiSegments = z.infer<
  typeof GetSingleTestApiSegmentsSchema
>;
const GetSingleTestApiSearchParamsSchema = z.object({
  search: z.string(),
  amount: z.coerce.number(),
  type: z.union([z.literal("test-1"), z.literal("test-2")]),
});
export type GetSingleTestApiSearchParams = z.infer<
  typeof GetSingleTestApiSearchParamsSchema
>;

// Register the route
RouteTest.get<
  GetSingleTestApiResponse,
  GetSingleTestApiSegments,
  GetSingleTestApiSearchParams
>({
  path: "/:id/:test",
  method: "GET",
  middleware: [middlewareRequireAuth],
  parse: {
    segments: GetSingleTestApiSegmentsSchema,
    params: GetSingleTestApiSearchParamsSchema,
  },
  handler: async (req, env, context, res) => {
    const query = await context.prisma.team.findMany({
      where: {
        id: "1",
      },
    });
    console.log(query);

    return res({
      json: {
        data: { message: "Hello test", id: context.segments.id },
      },
      status: 200,
    });
  },
});

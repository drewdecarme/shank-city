import type { ApiResponse } from "@flare-city/core";
import { RouteSample } from "./sample.route";
import { middlewareSample } from "./sample.middleware";
import { z } from "zod";

// Get test by ID
export type GetSingleSampleApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
const GetSingleSampleApiSegmentsSchema = z.object({
  id: z.string(),
  test: z.string(),
});
export type GetSingleSampleApiSegments = z.infer<
  typeof GetSingleSampleApiSegmentsSchema
>;
const GetSingleSampleApiSearchParamsSchema = z.object({
  search: z.string(),
  amount: z.coerce.number(),
  type: z.union([z.literal("test-1"), z.literal("test-2")]),
});
export type GetSingleSampleApiSearchParams = z.infer<
  typeof GetSingleSampleApiSearchParamsSchema
>;

// Register the route
RouteSample.get<
  GetSingleSampleApiResponse,
  GetSingleSampleApiSegments,
  GetSingleSampleApiSearchParams
>({
  path: "/:id/:test",
  method: "GET",
  middleware: [middlewareSample],
  parse: {
    segments: GetSingleSampleApiSegmentsSchema,
    params: GetSingleSampleApiSearchParamsSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: { message: "Hello test", id: context.segments.id },
      },
      status: 200,
    });
  },
});

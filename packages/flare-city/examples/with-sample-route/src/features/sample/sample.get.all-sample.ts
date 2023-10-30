import type { ApiResponse } from "@flare-city/core";
import { RouteSample } from "./sample.route";
import { middlewareSample } from "./sample.middleware";

// Get all samples
export type GetAllSampleApiResponse = ApiResponse<{ message: string }>;

// Get all samples
RouteSample.get<GetAllSampleApiResponse>({
  path: "",
  method: "GET",
  middleware: [middlewareSample],
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: { message: "Hello sample" },
      },
      status: 200,
    });
  },
});

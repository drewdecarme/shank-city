import { ApiResponse } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";

// Get all tests
export type GetAllTestApiResponse = ApiResponse<{ message: string }>;

// Get all tests
RouteTest.register<GetAllTestApiResponse>({
  path: "",
  method: "GET",
  middleware: [middlewareRequireAuth],
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: { message: "Hello test" },
      },
      status: 200,
    });
  },
});

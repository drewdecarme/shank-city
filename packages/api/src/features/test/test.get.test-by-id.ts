import { ApiResponse } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
export type GetSingleTestApiSegments = { id: string };
export type GetSingleTestApiSearchParams = {
  search: string;
  date__gte: number;
};

RouteTest.register<
  GetSingleTestApiResponse,
  GetSingleTestApiSearchParams,
  GetSingleTestApiSegments
>({
  path: "/:id",
  method: "GET",
  middleware: [middlewareRequireAuth],
  validate: {
    segments: {
      id: true,
    },
    params: {
      search: {
        type: "string",
      },
    },
  },
  handler: async (req, env, context, res) => {
    const query = await context.prisma.team.findMany({
      where: {
        id: "1",
      },
    });

    return res({
      json: {
        data: { message: "Hello test", id: context.segments.id },
      },
      status: 200,
    });
  },
});

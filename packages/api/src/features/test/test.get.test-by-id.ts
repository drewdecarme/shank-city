import { ApiResponse, ErrorBadRequest } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
export type GetSingleTestApiSegments = { id: string };
export type GetSingleTestApiSearchParams = { search: string };

RouteTest.register<
  GetSingleTestApiResponse,
  GetSingleTestApiSearchParams,
  GetSingleTestApiSegments
>({
  path: "/:id",
  method: "GET",
  middleware: [middlewareRequireAuth],
  validate: {
    segments: { id: null },
    params: {
      search: {
        type: "number",
      },
    },
  },
  handler: async (req, env, context, res) => {
    // add type guard here
    if (!context.segments?.id) throw new ErrorBadRequest("Missing :id in URL");

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

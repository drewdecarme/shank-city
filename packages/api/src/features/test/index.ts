import { CFRoute } from "../../lib";
import { ApiResponse } from "../../lib/types";
import { ErrorBadRequest } from "../../utils";

export const RouteTest = new CFRoute({ basePath: "/test" });

// Get all tests
export type GetAllTestApiResponse = ApiResponse<{ message: string }>;
RouteTest.register<GetAllTestApiResponse>({
  path: "",
  method: "GET",
  authenticate: true,
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: { message: "Hello test" },
      },
      status: 200,
    });
  },
});

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
export type GetSingleTestApiSegments = { id: string };
RouteTest.register<GetSingleTestApiResponse, GetSingleTestApiSegments>({
  path: "/:id",
  method: "GET",
  authenticate: true,
  validate: {
    segments: { id: null },
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

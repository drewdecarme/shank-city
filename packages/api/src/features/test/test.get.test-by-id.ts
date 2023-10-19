import { ApiResponse, parse } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;
export type GetSingleTestApiSegments = { id: string; test: string };
export type GetSingleTestApiSearchParams = {
  search: string;
  amount: number;
  type: "test-1" | "test-2";
};

RouteTest.register<
  GetSingleTestApiResponse,
  GetSingleTestApiSearchParams,
  GetSingleTestApiSegments
>({
  path: "/:id/:test",
  method: "GET",
  middleware: [middlewareRequireAuth],
  validate: {
    segments: {
      id: parse("id").asString(),
      test: parse("test").asString(),
    },
    params: {
      search: parse("search").asString(),
      amount: parse("amount").asNumber().max(5, "Has to be less than 5"),
      type: parse("type").asArray<GetSingleTestApiSearchParams["type"]>([
        "test-1",
        "test-2",
      ]),
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

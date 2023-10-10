import { Route, ApiResponse, errorHandler } from "@flare-city/core";
import { Team } from "@prisma/client";
import { log, middlewareRequireAuth } from "../../lib";

export const RouteTeam = new Route({ basePath: "/team" });

// Get All Teams
export type GetAllTeamsApiResponse = ApiResponse<Team[]>;
RouteTeam.register<GetAllTeamsApiResponse>({
  path: "",
  method: "GET",
  middleware: [middlewareRequireAuth],
  handler: async (req, env, context, res) => {
    try {
      log.setName("Feature:Teams");
      log.info("Fetching all teams");
      const data = await context.prisma.team.findMany();
      log.info("Fetching all teams... successful", data);
      return res({
        json: {
          data,
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
});

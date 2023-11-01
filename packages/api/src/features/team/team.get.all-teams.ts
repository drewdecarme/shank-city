import type { ApiResponse } from "@flare-city/core";
import { errorHandler } from "@flare-city/core";
import type { Team } from "@prisma/client";
import { log, middlewareRequireAuth } from "../../lib";
import { RouteTeam } from "./team.route";

// Get All Teams
export type GetAllTeamsApiResponse = ApiResponse<Team[]>;

RouteTeam.get<GetAllTeamsApiResponse>({
  path: "",
  method: "GET",
  middleware: [middlewareRequireAuth],
  handler: async (req, env, context, res) => {
    try {
      log.setName("Feature:Teams");
      log.info("Fetching all teams");
      const data = await context.prisma.team.findMany();
      log.info("Fetching all teams... successful");
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

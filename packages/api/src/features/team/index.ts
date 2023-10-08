import { Team } from "@prisma/client";
import { CFRoute } from "../../lib";
import { ErrorBadRequest, errorHandler, log } from "../../utils";
import { ApiResponse } from "../../lib/types";

export const RouteTeam = new CFRoute({ basePath: "/team" });

// Get All Teams
export type GetAllTeamsApiResponse = ApiResponse<Team[]>;
RouteTeam.register<GetAllTeamsApiResponse>({
  path: "",
  method: "GET",
  authenticate: true,
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

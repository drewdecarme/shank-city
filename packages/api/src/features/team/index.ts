import { Team } from "@prisma/client";
import { CFRoute } from "../../lib";
import { ErrorBadRequest } from "../../utils";
import { ApiResponse } from "../../lib/types";

export const RouteTeam = new CFRoute({ basePath: "/team" });

// Get All Teams
export type GetAllTeamsApiResponse = ApiResponse<Team[]>;
RouteTeam.register<GetAllTeamsApiResponse>({
  path: "",
  method: "GET",
  authenticate: true,
  handler: async (req, env, context, res) => {
    const data = await context.prisma.team.findMany();
    return res({
      json: {
        data,
      },
    });
  },
});

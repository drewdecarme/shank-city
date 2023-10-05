import { Handler, RouteDefinition } from "../../utils";

const handler: Handler = async (req, env, ctx) => {
  return new Response("Hello Test");
};

export const routeTest: RouteDefinition = {
  namespace: "/test",
  handler,
};

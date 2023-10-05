import { authenticate } from "../../lib";
import { Handler, RouteDefinition, errorHandler } from "../../utils";

const handler: Handler = async (req, env, ctx) => {
  try {
    await authenticate(req, env);
    return new Response(JSON.stringify({ message: "Hello Test" }));
  } catch (error) {
    return errorHandler(error);
  }
};

export const routeTest: RouteDefinition = {
  namespace: "/test",
  handler,
};

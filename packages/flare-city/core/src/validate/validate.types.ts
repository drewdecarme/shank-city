import { MatchedRoute } from "../route";
import { Middleware } from "../utils";

export type ValidateMiddleware = (route: MatchedRoute) => Middleware;

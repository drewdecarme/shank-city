import { MatchedRoute } from "../route";
import {
  Middleware,
  RequestURLSearchParams,
  RequestURLSegments,
} from "../utils";

export type ValidateMiddleware = (
  data: RequestURLSegments | RequestURLSearchParams
) => Middleware;

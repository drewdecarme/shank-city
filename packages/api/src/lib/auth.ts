import { Env, ErrorUnauthorized } from "../utils";
import { parseJwt } from "@cfworker/jwt";

export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<boolean> {
  try {
    // grab the token from the request
    const jwt = getTokenFromRequest(request);

    const issuer = env.API_AUTH0_DOMAIN;
    const audience = env.API_AUTH0_CLIENT_AUDIENCE;

    // parse and verify the jwt
    const jwtResult = await parseJwt(jwt, issuer, audience);

    // If it fails to parse, throw the reason
    if (!jwtResult.valid) throw jwtResult.reason;

    return true;
  } catch (error) {
    throw new ErrorUnauthorized(error as string);
  }
}

function getTokenFromRequest(request: Request): string {
  const authorizationHeader = request.headers.get("Authorization");
  if (!authorizationHeader) throw "Missing Authorization Header";

  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw "Malformed Authorization Header";
  }

  return token;
}

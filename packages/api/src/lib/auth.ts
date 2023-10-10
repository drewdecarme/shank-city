import { Env, ErrorUnauthorized } from "../../../flare-city/core/src/utils";
import { parseJwt } from "@cfworker/jwt";

export async function authenticateRequest(
  request: Request,
  env: Env,
  context: ExecutionContext
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

    // get the Auth0 username which is the subject form the payload
    const username = jwtResult.payload.sub;

    // Find or create the user in the DB
    const user = await context.prisma.user.upsert({
      where: {
        username,
      },
      update: {},
      create: {
        username,
      },
    });

    // set the user to the context.auth
    context.auth = {
      authenticated: true,
      user,
    };

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

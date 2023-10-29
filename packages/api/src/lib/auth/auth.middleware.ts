import type { Middleware } from "@flare-city/core";
import { ErrorUnauthorized } from "@flare-city/core";
import { parseJwt } from "@cfworker/jwt";
import { log } from "../logger";

/**
 * A request middleware that requires the user to be
 * Authenticated. If all checks pass, then the user is fetched
 * from the DB and the execution context is enhanced with
 * a user
 */
export const middlewareRequireAuth: Middleware = async (
  request,
  env,
  context
) => {
  log.setName("Middleware:Authentication");

  try {
    // grab the token from the request
    log.debug(`Grabbing Authorization token from request...`);
    const jwt = getTokenFromRequest(request);
    log.debug(`Grabbing Authorization token from request... done`);

    const issuer = env.API_AUTH0_DOMAIN;
    const audience = env.API_AUTH0_CLIENT_AUDIENCE;

    // parse and verify the jwt
    log.debug(`Parsing and validating JWT...`);
    const jwtResult = await parseJwt(jwt, issuer, audience);

    // If it fails to parse, throw the reason
    if (!jwtResult.valid) {
      log.error(`Parsing and validating JWT... ERROR`);
      throw jwtResult.reason;
    }

    log.debug(`Parsing and validating JWT... successful`);

    // get the Auth0 username which is the subject form the payload

    const username = jwtResult.payload.sub;
    log.debug(`Username: ${username}`, { username });

    // Find or create the user in the DB
    log.debug(`FindOrCreate user "${username}"...`, { username });
    const user = await context.prisma.user.upsert({
      where: {
        username,
      },
      update: {},
      create: {
        username,
      },
    });
    log.debug(`FindOrCreate user "${username}"... done.`, { username });

    // set the user to the context.auth
    log.debug(`Adding auth to execution context as 'context.auth'`);
    context.auth = {
      authenticated: true,
      user,
    };
  } catch (error) {
    throw new ErrorUnauthorized(error as string);
  }
};

function getTokenFromRequest(request: Request): string {
  const authorizationHeader = request.headers.get("Authorization");
  if (!authorizationHeader) throw "Missing Authorization Header";

  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw "Malformed Authorization Header";
  }

  return token;
}

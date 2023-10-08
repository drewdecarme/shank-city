import { ZodError, z } from "zod";
import { Env, ErrorNotFound, ErrorValidation, errorHandler } from "../../utils";
import { authenticateRequest } from "../auth";
import { ApiRequestSegments } from "./route.types";
import { extractSegmentsFromURL, isPathnameMatch } from "./route.utils";
import { ApiResponse } from "../types";

interface CFRouteConstructorParams {
  basePath: string;
  authenticate?: boolean;
}

export type CFRouteHandlerResponse<T extends Record<string, unknown>> = (
  params: { json: T } & { status?: 200 | 301 }
) => Promise<Response>;

type CFRouteMethod = "GET" | "POST";
type CFRouteHandler<
  T extends Record<string, unknown> = Record<string, unknown>,
  S extends ApiRequestSegments = ApiRequestSegments,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S>,
  res: CFRouteHandlerResponse<T>
) => Promise<Response>;

export type CFRouteDefinition<
  T extends Record<string, unknown> = Record<string, unknown>,
  S extends ApiRequestSegments = ApiRequestSegments,
> = {
  path: string;
  method: CFRouteMethod;
  authenticate?: boolean;
  validate?: {
    segments?: { [key in keyof S]: string | null };
  };
  handler: CFRouteHandler<T, S>;
};

export class CFRoute implements CFRouteConstructorParams {
  basePath: string;
  requests: CFRouteDefinition[];

  constructor(params: CFRouteConstructorParams) {
    this.basePath = params.basePath;
    this.requests = [];
  }

  register<
    T extends ApiResponse<unknown>,
    S extends ApiRequestSegments = ApiRequestSegments,
  >(params: CFRouteDefinition<T, S>) {
    /**
     * RATIONALE: Don't really care about the internal
     * types of this... all we care is that it get's stored
     * in the requests array and then can be parsed appropriately
     */
    // @ts-ignore
    this.requests.push(params);
  }

  private validateRequestSegments(
    route: CFRouteDefinition,
    request: Request,
    context: ExecutionContext
  ) {
    // If no segments are defined, exit early
    if (!route.path.includes(":")) return;

    const { pathname } = new URL(request.url);
    const parsedSegments = extractSegmentsFromURL(
      pathname,
      `${this.basePath}${route.path}`
    );

    // If there is no validation, set segments to context
    // and exit early.
    if (!route.validate?.segments) {
      context.segments = parsedSegments;
      return;
    }

    // Construct a zod schema to validate the parsedSegments
    const segmentSchemaDef = Object.entries(route.validate.segments).reduce(
      (accum, [segmentProperty, segmentErrorMessage]) => {
        return {
          ...accum,
          [segmentProperty]: z.string({
            required_error:
              segmentErrorMessage ??
              `Missing ':${segmentProperty}' segment in the request URL.`,
          }),
        };
      },
      {}
    );
    const segmentSchema = z.object(segmentSchemaDef);

    try {
      segmentSchema.parse(parsedSegments);
      context.segments = parsedSegments;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ErrorValidation({
          message: `Failed to validate URL segments`,
          data: error.issues.reduce(
            (accum, issue) => ({
              ...accum,
              [issue.path.join(".")]: issue.message,
            }),
            {}
          ),
        });
      }
    }
  }

  async run(request: Request, env: Env, context: ExecutionContext) {
    // create a response handler
    const res: CFRouteHandlerResponse<Record<string, unknown>> = async ({
      json,
      status = 200,
    }) => new Response(JSON.stringify(json), { status });
    const { pathname: requestURL } = new URL(request.url);

    // Match the route with the request URL
    const route = this.requests.reduce<CFRouteDefinition | undefined>(
      (accum, routeDef) => {
        const routePath = `${this.basePath}${routeDef.path}`;
        const pathnamesMatch = isPathnameMatch(routePath, requestURL);

        if (pathnamesMatch) return routeDef;
        return accum;
      },
      undefined
    );

    try {
      // check if the route exists
      if (!route) {
        throw new ErrorNotFound("The route does not exist");
      }

      // validate the authorization headers
      if (route.authenticate) {
        await authenticateRequest(request, env, context);
      }

      // validate segment completeness
      this.validateRequestSegments(route, request, context);

      // Run the handler
      return route.handler(request, env, context, res);
    } catch (error) {
      return errorHandler(error);
    }
  }
}

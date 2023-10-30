import type { ZodType } from "zod";
import { ZodError } from "zod";
import type {
  Middleware,
  RequestURLSearchParams,
  RequestURLSegments,
} from "../utils";
import { ErrorValidation, log } from "../utils";

/**
 * Parses, validates, and then enriches the context with
 * the segments defined in the `route.path` record.
 *
 * This is a curried function that intakes the validation
 * requirements needed to dynamically create a Zod schema
 * and then returns a function that can be run to pass in
 * the required args.
 */
export const createMiddlewareValidate =
  <T extends RequestURLSegments | RequestURLSearchParams>({
    name,
    schema,
    contextKey,
  }: {
    name: string;
    schema: ZodType<T>;
    contextKey: keyof Omit<
      ExecutionContext,
      "passThroughOnException" | "waitUntil"
    >;
  }): Middleware =>
  async (request, env, context) => {
    log.debug(`Running ${name} validation middleware...`);

    try {
      const data = context[contextKey];
      const parsedData = schema.parse(data);
      /**
       * RATIONALE: Not really interested in type perseveration here
       * since we're providing a key that was added
       * in context to when this function is called.
       */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context[contextKey] = parsedData;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ErrorValidation({
          message: "Validation failed.",
          data: {
            issues: error.issues.reduce<
              {
                path: string;
                code: string;
                received: string;
                expected: string;
                message: string;
              }[]
            >((accum, issue) => {
              switch (issue.code) {
                case "invalid_type":
                  return [
                    ...accum,
                    {
                      path: [contextKey, ...issue.path].join("."),
                      code: issue.code,
                      expected: issue.expected,
                      received: issue.received,
                      message: issue.message,
                    },
                  ];
                case "invalid_union":
                  return [
                    ...accum,
                    ...issue.unionErrors.flatMap(({ issues, name: _ }) => {
                      return issues.map(
                        // these are here
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        ({ received, expected, path, code }) => {
                          const message = `Received: ${received}, Expected: ${expected}`;
                          return {
                            code,
                            path: [contextKey, ...path].join("."),
                            received,
                            expected,
                            message,
                          };
                        }
                      );
                    }),
                  ];

                default:
                  return accum;
              }
            }, []),
          },
        });
      }
    }

    log.debug(`Running ${name} validation middleware... done.`);
  };

import { ZodError, ZodType } from "zod";
import {
  ErrorValidation,
  Middleware,
  RequestURLSearchParams,
  RequestURLSegments,
  log,
} from "../utils";
import { fromZodError, fromZodIssue } from "zod-validation-error";

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
       * Not really interested in type perseveration here
       * since we're providing a key that was added
       * in context to when this function is called.
       */
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
                case "invalid_union":
                  return [
                    ...accum,
                    ...issue.unionErrors.flatMap(({ issues, name }) => {
                      return issues.map(
                        // these are here
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

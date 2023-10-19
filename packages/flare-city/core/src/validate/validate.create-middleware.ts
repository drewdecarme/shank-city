import { z, ZodError } from "zod";
import { ErrorValidation, RequestURLSegments, log } from "../utils";
import { ValidateMiddleware } from "./validate.types";
import { Parser, ParserSchemas } from "./Parser";

export type ValidateMiddlewareArgs<T> = {
  [key in keyof T]: ParserSchemas;
};

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
  <T extends RequestURLSegments>(
    args: ValidateMiddlewareArgs<T>
  ): ValidateMiddleware =>
  (propertiesToValidate) =>
  async (request, env, context) => {
    log.debug("Running validation middleware...");

    // loop through all of the entries in the validation
    Object.entries(args).forEach(([property, schema]) => {
      try {
        // parse the string schema
        const data = propertiesToValidate[property];
        schema.parse(data);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ErrorValidation({
            message: "Validation failed.",
            data: error.issues.reduce(
              (accum, issue) => ({
                ...accum,
                [property]: issue.message,
              }),
              {}
            ),
          });
        }
      }
    });

    log.debug("Running validation middleware... done.");
  };

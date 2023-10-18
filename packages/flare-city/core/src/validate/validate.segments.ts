import { z, ZodError } from "zod";
import { ErrorValidation, RequestURLSegments, log } from "../utils";
import { ValidateMiddleware } from "./validate.types";

export type ValidateSegmentsArgs<T> = {
  [key in keyof T]: true | string;
};

export type ValidateSegments<T extends RequestURLSegments> = (
  args: ValidateSegmentsArgs<T>
) => ValidateMiddleware;

/**
 * Parses, validates, and then enriches the context with
 * the segments defined in the `route.path` record.
 *
 * This is a curried function that intakes the validation
 * requirements needed to dynamically create a Zod schema
 * and then returns a function that can be run to pass in
 * the required args.
 */
export const validateSegments =
  <T extends RequestURLSegments>(
    args: ValidateSegmentsArgs<T>
  ): ValidateMiddleware =>
  ({ route, pattern }) =>
  async (request, env, context) => {
    log.debug("Running segment middleware...");

    const parsedSegments = pattern.pathname.groups;
    context.segments = parsedSegments;

    // Construct a zod schema to validate the parsedSegments
    const segmentSchema = z.object(
      Object.entries(args).reduce(
        (accum, [segmentProperty, segmentErrorMessage]) => {
          return {
            ...accum,
            [segmentProperty]: z.string({
              required_error:
                typeof segmentErrorMessage === "string"
                  ? segmentErrorMessage
                  : `Missing ':${segmentProperty}' segment in the request URL.`,
            }),
          };
        },
        {}
      )
    );

    // Parse the segments against the schema
    // and set the validated parsed segments to the
    // `context.segments`
    try {
      segmentSchema.parse(parsedSegments);
      context.segments = parsedSegments;
      log.debug("Running segment middleware... done.");
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
  };

import { RequestURLSearchParams, log } from "../utils";
import { ValidateMiddleware } from "./validate.types";

type ValidateParamsString = {
  type: "string";
  test?: string;
  match?: string[];
};

type ValidateParamsNumber = {
  type: "number";
  min?: {
    value: number;
    message?: string;
  };
  max?: {
    value: number;
    message?: string;
  };
};

type ValidateParams = ValidateParamsString | ValidateParamsNumber;

export type ValidateParamsArgs<T extends RequestURLSearchParams> = Partial<{
  [key in keyof T]: ValidateParamsString | ValidateParamsNumber;
}>;

export const validateParams =
  <T extends RequestURLSearchParams>(
    args: ValidateParamsArgs<T>
  ): ValidateMiddleware =>
  ({ route, pattern }) =>
  async (request, env, context) => {
    log.debug("Running param middleware...");

    const searchEntries = new URLSearchParams(pattern.search.input).entries();
    const searchParams = Object.fromEntries(searchEntries);

    context.params = searchParams;

    // Construct a Zod schema based upon the args
    // const paramsSchemaObject = Object.entries(args).reduce(
    //   (accum, [paramName, paramValues]) => {
    //     switch (paramValues?.type) {
    //       case "string":
    //         break;

    //       case "number":
    //         break;

    //       default:
    //     }
    //   },
    //   {}
    // );

    log.debug("Running param middleware... done.");
  };

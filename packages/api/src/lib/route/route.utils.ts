import { z } from "zod";
import { ApiRequestSegments } from "./route.types";
import { CFRouteDefinition } from "./Route";

/**
 * Extracts parameters from the URL based on a pattern.
 * @param url - The URL to extract parameters from.
 * @param pattern - The pattern to match against the URL.
 * @returns An object containing the extracted parameters.
 */
export const extractSegmentsFromURL = <
  T extends ApiRequestSegments = ApiRequestSegments,
>(
  url: string,
  pattern: string
): T | undefined => {
  const regex = new RegExp(
    pattern.replace(/:[a-zA-Z0-9_-]+/g, "([a-zA-Z0-9_-]+)")
  );
  const match = url.match(regex);

  if (!match) return undefined;

  const paramNames = pattern.match(/:[a-zA-Z0-9_-]+/g) || [];
  return paramNames.reduce((accum, param, index) => {
    // @ts-ignore
    accum[param.substr(1) as keyof T] = match[index + 1];
    return accum;
  }, {} as T);
};

/**
 * Determines if a pathname matches a pattern. This is for comparing
 * the request URL against the defined route path
 */
export function isPathnameMatch(pattern: string, pathname: string) {
  const regex = new RegExp(
    "^" + pattern.replace(/:[a-zA-Z0-9_-]+/g, "([a-zA-Z0-9_-]+)") + "$"
  );
  return regex.test(pathname);
}

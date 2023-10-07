export type ApiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

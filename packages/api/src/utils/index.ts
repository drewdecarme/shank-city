export type RouteDefinition = {
  namespace: string;
  handler: Handler;
};

export type Handler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response>;

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

class AppError extends Error {
  status_code: number;
  status_text: string;

  constructor(params: {
    message: string;
    status_code: number;
    status_text: string;
  }) {
    super(params.message);
    this.status_code = params.status_code;
    this.status_text = params.status_text;
  }
}

/**
 * Format's an error message and appends extra content onto
 * it if provided
 */
const formatErrorMessage = (prefix: string, message?: string) =>
  `${prefix}${message ? `: ${message}` : ""}`;

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Not Found", message),
      status_code: 404,
      status_text: "Not Found",
    });
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Unauthorized", message),
      status_code: 401,
      status_text: "Unauthorized",
    });
    this.name = "NotFoundError";
  }
}

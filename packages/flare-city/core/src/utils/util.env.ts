import type { LogLevel, LoggingType } from "@flare-city/logger";

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
  //
  //   Vars:
  API_AUTH0_DOMAIN: string;
  API_AUTH0_CLIENT_ID: string;
  API_AUTH0_CLIENT_AUDIENCE: string;
  DATABASE_URL: string;
  LOG_LEVEL: LogLevel;
  LOG_TYPE: LoggingType;

  HYPERDRIVE: Hyperdrive;
}

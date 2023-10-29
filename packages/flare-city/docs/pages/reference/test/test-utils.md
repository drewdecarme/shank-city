# `@flare-city/test` - Testing Utils

The below documentation will describe the workings of the opinionated utilities exported from the `@flare-city/test` package that will make your testing easier.

- [WorkerTest](#workertest-class) - A class utility designed to simplify construction requests to your `flare-city` endpoints.
- [setupFile](#setup-file) - A file that can be added to the `vitest.test.setupFiles` configuration option to easily start and stop your worker during your test runs.

## WorkerTest Class

The `WorkerTest` class is a utility class designed to simplify the process of testing Cloudflare Workers using the Vitest framework. It provides methods to format requests and interact with the worker during tests.

### Constructor

```typescript
constructor(worker: typeof global.worker);
```

- `worker`: The Cloudflare worker instance to be used for testing.

### Methods

#### `get`

```ts
// Type Signature
get<R, P>(options: { endpoint: string; params?: P; requestInit?: RequestInit }): Promise<{ json: R; raw_response: Response }>
```

Performs a GET request to the specified endpoint with optional parameters and request initialization.

- `endpoint`: The endpoint URL for the GET request.
- `params`: Optional URL parameters for the request.
- `requestInit`: Optional `RequestInit` object for additional configurations.

Returns a promise with the JSON response and the raw `Response` object.

**Response Structure**

The response from the `get` method is an object with the following properties:

- `json`: The parsed JSON content of the response body. The type is specified by the generic parameter `R`.
- `raw_response`: The raw `Response` object returned by the `fetch` API.

Example:

```typescript
const res = await worker.get<SomeResponseType>({
  endpoint: "/some-endpoint",
  params: { key: "value" },
  requestInit: { method: "POST" },
});

// Accessing the response properties
const jsonResponse: SomeResponseType = res.json;
const rawResponse: Response = res.raw_response;
```

This structure allows developers to access both the parsed JSON content and the raw response, providing flexibility in handling different aspects of the Cloudflare Worker response during testing.

**Example**

Below is an example of how to use it.

```ts
import { expect, test, describe } from "vitest";
import type { GetAllTestApiResponse } from "./test.get.all-test";

describe("GET /test", () => {
  let worker: WorkerTest;

  test("Should respond with a hello test", async () => {
    worker = new WorkerTest(global.worker);
    const res = await worker.get<GetAllTestApiResponse>({
      endpoint: "/test",
    });
    expect(res.json).toMatchObject<GetAllTestApiResponse>({
      data: { message: "Hello Test" },
    });
  });

  // Add more tests as needed
});
```

## Setup File

The setup file is a Vitest configuration file (`vitest.config.ts`) that ensures proper setup for testing Cloudflare Workers using the `WorkerTest` class.

### Creating a setup

Create a `vitest.config.ts` file at the root of the repo / package that you want to test and add the `@flare-city/test/setup` file. The `setupFiles` array is to be executed before running tests. In this case, it includes `@flare-city/test/setup` to set up the `WorkerTest` class.

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["@flare-city/test/setup"],
  },
});
```

### Purpose

The `setupFiles` array in the Vitest configuration specifies setup files to be executed before running tests. In this case, `"@flare-city/test/setup"` is included to ensure proper setup for testing Cloudflare Workers using the `@flare-city/test` package.

```typescript
import { beforeAll } from "vitest";
import { unstable_dev } from "wrangler";
import { resolve } from "path";

beforeAll(async () => {
  // Retrieve the current working directory
  const currentDir = process.cwd();
  console.log("currentDir", currentDir);

  // Resolve the path to the Cloudflare Worker script
  const workerPath = resolve(process.cwd(), "./src/index.ts");

  // Initialize the Cloudflare worker using wrangler's unstable_dev function
  const worker = await unstable_dev(workerPath, {
    experimental: { disableExperimentalWarning: true },
  });

  // Add the worker instance to the global context for Vitest
  global.worker = worker;

  // Define the cleanup function to stop the worker after all tests
  return async () => {
    if (!global.worker) return;
    await global.worker.stop();
    delete global.worker;
  };
});
```

### Explanation

1. **Retrieve Current Working Directory:**
   The `process.cwd()` function is used to obtain the current working directory. This ensures that the paths are resolved relative to the location where the tests are executed.

2. **Resolve Worker Script Path:**
   `resolve(process.cwd(), "./src/index.ts")` constructs the absolute path to the Cloudflare Worker script. Adjust the path as needed based on your project structure.

3. **Initialize Cloudflare Worker:**
   The `unstable_dev` function from Wrangler initializes the Cloudflare Worker for testing. It takes the path to the worker script and an optional configuration object. In this case, experimental features are disabled to suppress experimental warnings.

4. **Add Worker to Global Context:**
   `global.worker = worker;` adds the worker instance to the global context. This makes it accessible in the test files, allowing seamless interaction with the worker during testing.

5. **Define Cleanup Function:**
   The `return async () => {...}` block defines a cleanup function. This function is executed after all tests (`afterAll`). It stops the worker to ensure a clean environment, preventing potential interference between test cases.

### `beforeAll` & `afterAll`

- **`beforeAll`:**

  - Purpose: Executes setup actions before running tests.
  - In this context: Initializes the Cloudflare Worker and adds it to the global context for testing.

- **`afterAll`:**
  - Purpose: Executes cleanup actions after all tests are completed.
  - In this context: Stops the Cloudflare Worker to ensure a clean environment.

This setup ensures that the Cloudflare Worker is properly initialized before tests begin and is gracefully stopped after all tests are completed. The global context integration allows seamless access to the worker instance across test files.

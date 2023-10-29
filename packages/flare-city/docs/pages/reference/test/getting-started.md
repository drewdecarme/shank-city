# `@flare-city/test` - Getting Started

## 1. Install Dependencies:

Make sure to install the necessary dependencies for your project:

```bash
npm install @flare-city/test vitest wrangler
```

## 2. Create a `vitest.config.ts`

Create the config file at the root of your repository.

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["@flare-city/test/setup"],
  },
});
```

## 3. Create WorkerTest Instance:

In your test files, create an instance of `WorkerTest` by passing the Cloudflare worker instance.

```typescript
import { WorkerTest } from "@flare-city/test";

// Assuming global.worker is your Cloudflare worker instance
const worker = new WorkerTest(global.worker);
```

## 4. Write Tests:

Use the `WorkerTest` instance to write tests for your Cloudflare Worker.

```typescript
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

## 5. Run Tests:

Execute your tests using `@flare-city/cli`. This CLI is a wrapper around the node executable of Vitest. We do this since there are a few configuration options that we mandate for the Vitest config. However, you can always use the options in the [Vitest CLI configurations](https://vitest.dev/guide/cli.html)

```bash
yarn flare-city test
```

This setup allows you to easily integrate and run tests for your Cloudflare Worker using the `WorkerTest` class and the Vitest framework. Customize the configuration as needed for your specific project requirements.

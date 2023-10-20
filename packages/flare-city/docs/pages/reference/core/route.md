# `@flare-city/core` - Routing

## Overview

The `Route` class in the `@flare-city/core` package facilitates the definition and handling of routes within a web application. It allows developers to create RESTful routes, define route parameters, and specify middleware functions to be executed before the route handler.

## Key Concepts

### 1. Route Methods

- **Definition:**

  - Routes can handle different HTTP methods such as `GET` and `POST`.
  - Methods are defined using the `get` and `post` methods on an instance of the `Route` class.

- **Methods:**
  - `get`: Registers a route for handling `GET` requests.
  - `post`: Registers a route for handling `POST` requests.

### 2. Middleware Execution

- **Definition:**

  - Middleware functions can be defined at both the route and application levels.
  - Middleware functions are executed sequentially before the main route handler is called.

- **Middleware Execution Order:**
  - Route-level middleware is executed before the route handler.
  - Application-level middleware is executed before any route-specific middleware.

### 3. Route Parsing

- **Definition:**
  - Routes can define parsing schemas for URL segments and search parameters.
  - Parsing schemas use Zod Schemas for validation and extraction of data from URL components.

## How to Use

### Creating and Registering a Route

```typescript
import { Route } from "@flare-city/core";

const myRoute = new Route({ root: "/api" });

myRoute.get({
  path: "/example/:id",
  middleware: [myMiddleware],
  parse: {
    segments: MySegmentsSchema,
    params: MyParamsSchema,
  },
  handler: async (req, env, context, res) => {
    // Your route logic here
  },
});

myRoute.post({
  path: "/submit",
  middleware: [anotherMiddleware],
  handler: async (req, env, context, res) => {
    // Your route logic here
  },
});
```

### Defining Route Parsing Schemas

#### Zod Schemas

- **URL Segments:**

  - Zod Schemas for URL segments define the expected structure and types of URL path components.

  ```typescript
  import { z } from "zod";

  const MySegmentsSchema = z.object({
    id: z.string(),
  });
  ```

- **Search Parameters:**

  - Zod Schemas for search parameters define the expected structure and types of URL query parameters.

  ```typescript
  import { z } from "zod";

  const MyParamsSchema = z.object({
    search: z.string(),
    amount: z.coerce.number(),
  });
  ```

### Running a Route in an Application

```typescript
import { App } from "@flare-city/core";
import { Route } from "@flare-city/core";

const myApp = new App("MyApp");

myApp.addMiddleware(myAppMiddleware);

const myRoute = new Route({ root: "/api" });

myApp.addRoute(myRoute);

const response = myApp.run(request, env, context);
```

## Example: Using RouteTest

The following example demonstrates how to use the `RouteTest` route with specific parsing schemas for URL segments and search parameters:

```typescript
import { ApiResponse } from "@flare-city/core";
import { RouteTest } from "./test.route";
import { middlewareRequireAuth } from "../../lib";
import { z } from "zod";

// Get test by ID
export type GetSingleTestApiResponse = ApiResponse<{
  message: string;
  id: string;
}>;

const GetSingleTestApiSegmentsSchema = z.object({
  id: z.string(),
  test: z.string(),
});

export type GetSingleTestApiSegments = z.infer<
  typeof GetSingleTestApiSegmentsSchema
>;

const GetSingleTestApiSearchParamsSchema = z.object({
  search: z.string(),
  amount: z.coerce.number(),
  type: z.union([z.literal("test-1"), z.literal("test-2")]),
});

export type GetSingleTestApiSearchParams = z.infer<
  typeof GetSingleTestApiSearchParamsSchema
>;

// Register the route
RouteTest.get<
  GetSingleTestApiResponse,
  GetSingleTestApiSegments,
  GetSingleTestApiSearchParams
>({
  path: "/:id/:test",
  method: "GET",
  middleware: [middlewareRequireAuth],
  parse: {
    segments: GetSingleTestApiSegmentsSchema,
    params: GetSingleTestApiSearchParamsSchema,
  },
  handler: async (req, env, context, res) => {
    // Your route logic here
    return res({
      json: {
        data: { message: "Hello test", id: context.segments.id },
      },
      status: 200,
    });
  },
});
```

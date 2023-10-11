# `@flare-city/core` - Routing

## Overview

The `Route` class is a fundamental component of the `@flare-city/core` package, designed to simplify the development of APIs on Cloudflare Workers. It provides a structured approach to handling incoming requests, allowing developers to define routes, validate URL segments, and execute middleware functions.

## Key Concepts

### 1. Route Definition

A route is defined using the `RouteDefinition` interface, encapsulating the essential properties:

- **path:** The URL path for the route.
- **method:** The HTTP method for the route (GET or POST).
- **middleware:** An array of middleware functions to be executed before the route handler.
- **validate:** Optional validation for URL segments using Zod schemas.
- **handler:** The main function handling the request and generating a response.s

### 2. Middleware

Middleware functions are optional operations executed before the route handler. They can be used for authentication, logging, or any pre-processing required for a specific route.

### 3. URL Segment Validation

The `validate` property allows developers to specify URL segment validation using Zod schemas. This ensures that the expected segments are present in the request URL.

### 4. Request Handling

The `run` method orchestrates the entire process of handling a request. It matches the incoming request URL with registered routes, executes middleware, validates URL segments, and finally runs the route handler.

## How to Use

### 1. Creating a Route Instance

```typescript
import { Route } from "@flare-city/core";

const myRoute = new Route({ basePath: "/api" });
```

### 2. Registering a Route

```typescript
import { ApiResponse, Middleware } from "@flare-city/core";

myRoute.register<ApiResponse<any>>({
  path: "/example",
  method: "GET",
  middleware: [myMiddleware],
  validate: {
    segments: {
      id: null, // 'id' segment is required
    },
  },
  handler: async (req, env, context, res) => {
    // Your route logic here
  },
});
```

### 3. Adding the Route to an App

```typescript
import { App } from "@flare-city/core";

const myApp = new App("MyApp");
myApp.addRoute(myRoute);
```

### 4. Running the App

```typescript
const response = myApp.run(request, env, context);
```

## Examples

### Example 1: Basic Route

```typescript
myRoute.register<ApiResponse<any>>({
  path: "/home",
  method: "GET",
  handler: async (req, env, context, res) => {
    return res({
      json: { message: "Hello, World!" },
    });
  },
});
```

### Example 2: Route with Middleware and Validation

```typescript
myRoute.register<ApiResponse<any>>({
  path: "/user/:id",
  method: "GET",
  middleware: [authMiddleware],
  validate: {
    segments: {
      id: null, // 'id' segment is required
    },
  },
  handler: async (req, env, context, res) => {
    // Your route logic here
  },
});
```

## Conclusion

The `Route` class simplifies API development on Cloudflare Workers, offering flexibility, validation, and middleware support. By following the provided examples and guidelines, developers can create well-structured and reliable serverless APIs.

---

Feel free to adjust and expand this documentation based on your specific needs and the intended audience.

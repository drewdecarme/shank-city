# `@flare-city/core` - Middleware

## Overview

The `Middleware` type in the `@flare-city/core` package represents a function that can be used to perform pre-processing tasks or actions before the main route handler is executed. Middleware functions take an array of arguments, known as `HandlerArgs`, which includes the request object, environment variables, and the execution context.

## Key Concepts

### 1. Middleware Function

- **Definition:** Middleware functions are asynchronous functions that can modify or enhance the request handling process.
- **Signature:** `Middleware`: `(...args: HandlerArgs) => Promise<void>`

### 2. HandlerArgs

- **Definition:** `HandlerArgs` is a tuple type representing the arguments passed to a middleware function. It includes the request object, environment variables, and the execution context.
- **Signature:** `HandlerArgs<T extends RequestURLSegments = RequestURLSegments> = [Request, Env, ExecutionContext<T>]`

## How to Use

### 1. Creating a Middleware

```typescript
import { Middleware, HandlerArgs } from "@flare-city/core";

/**
 * Example Middleware: Log Request Information
 */
const logRequestInfo: Middleware = async (request, env, context) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Environment: ${env.NODE_ENV}`);
};
```

### 2. Using Middleware in a Route

```typescript
import { Middleware } from "@flare-city/core";
import { Route } from "@flare-city/core";

const myRoute = new Route({ basePath: "/api" });

const myMiddleware: Middleware = async (request, env, context) => {
  // Your middleware logic here
};

myRoute.register({
  path: "/example",
  method: "GET",
  middleware: [myMiddleware],
  handler: async (req, env, context, res) => {
    // Your route logic here
  },
});
```

### 3. Using Middleware in an App

```typescript
import { App } from "@flare-city/core";
import { Middleware } from "@flare-city/core";

const myApp = new App("MyApp");

const myMiddleware: Middleware = async (request, env, context) => {
  // Your middleware logic here
};

myApp.addMiddleware(myMiddleware);

const myRoute = new Route({ basePath: "/api", middleware: [myMiddleware] });

myApp.addRoute(myRoute);

const response = myApp.run(request, env, context);
```

## Example

### Add prisma client to execution context

The following example demonstrates a middleware function, `middlewarePrisma`, that adds a Prisma client to the execution context. This middleware can be used to provide database access to route handlers.

```typescript
import { Middleware } from "@flare-city/core";
import { createPrismaClient } from "./createPrismaClient";
import { log } from "../logger";

/**
 * Middleware to add the Prisma client to the execution
 * context of the request
 */
export const middlewarePrisma: Middleware = async (request, env, context) => {
  log.setName("Middleware:Prisma");

  log.info("Middleware: Creating PrismaClient and adding to context...");
  const prisma = createPrismaClient(env);
  context.prisma = prisma;
  log.info("Middleware: Creating PrismaClient and adding to context... done.");
};
```

## Conclusion

The `Middleware` type in the `@flare-city/core` package provides a powerful mechanism for customizing the request-handling flow. By creating and using middleware functions, developers can inject additional logic, such as logging, authentication, or database connections, into their routes and applications.

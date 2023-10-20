# Route Parsing and Validation with Zod Schemas

## Overview

In the `@flare-city/core` package, parsing and validation are critical aspects of handling incoming requests. By leveraging Zod Schemas, developers can efficiently enforce data integrity and ensure that the expected data structures are adhered to.

## Zod Schemas

[Zod](https://github.com/colinhacks/zod) is a TypeScript-first schema declaration and validation library. It's specifically designed to provide type safety and expressive syntax for defining the structure and types of data. In the context of route handling, Zod Schemas act as robust blueprints for validating and extracting data from incoming requests.

## Parsing URL Segments

Using Zod Schemas for parsing and validating JSON provides a straightforward and developer-friendly approach. With its intuitive syntax and powerful features, Zod simplifies the process of handling and ensuring the correctness of incoming data.

### Definition

URL segments are dynamic parts of the URL path that can contain variable values, such as IDs or slugs. Parsing involves extracting and validating these values using Zod Schemas, ensuring that the received data conforms to the expected structure.

### Example

```typescript
import { z } from "zod";

// Define a Zod Schema for URL Segments
const SegmentsSchema = z.object({
  id: z.string(),
  category: z.string().optional(), // Optional segment
});

// Usage in a Route Definition
RouteMyExample.get({
  path: "/example/:id/:category?",
  parse: { segments: SegmentsSchema },
  handler: async (req, env, context, res) => {
    // Access parsed segments
    const { id, category } = context.segments;
    // Your route logic here
  },
});
```

In this example, `SegmentsSchema` defines the expected structure of URL segments. The `optional()` modifier indicates that the `category` segment is optional.

## Parsing URL Params

### Definition

URL params are query parameters present in the URL's query string. Parsing involves extracting and validating these parameters using Zod Schemas, ensuring that the parameters meet specified criteria.

### Example

```typescript
import { z } from "zod";

// Define a Zod Schema for URL Params
const ParamsSchema = z.object({
  search: z.string(),
  page: z.number().int().positive(),
});

// Usage in a Route Definition
RouteMyExample.get({
  path: "/example",
  parse: { params: ParamsSchema },
  handler: async (req, env, context, res) => {
    // Access parsed params
    const { search, page } = context.params;
    // Your route logic here
  },
});
```

Here, `ParamsSchema` defines the expected structure of URL params, specifying that `search` must be a string, and `page` must be a positive integer.

## Parsing Request Body

### Definition

Parsing the request body involves extracting and validating data sent in the body of a `POST` request. Zod Schemas ensure the expected structure and types of the JSON payload, providing a powerful mechanism for enforcing data integrity.

### Example

```typescript
import { z } from "zod";

// Define a Zod Schema for Request Body
const BodySchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
});

// Usage in a Route Definition
RouteMyExample.post({
  path: "/submit",
  parse: { body: BodySchema },
  handler: async (req, env, context, res) => {
    // Access parsed request body
    const { username, password, email } = context.body;
    // Your route logic here
  },
});
```

In this case, `BodySchema` defines the expected structure of the request body, ensuring that `username` is a string, `password` has a minimum length of 8 characters, and `email` is a valid email address.

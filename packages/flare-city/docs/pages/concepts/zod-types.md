# Exporting and Utilizing Zod Types

## Overview

When working with Zod Schemas in the `@flare-city/core` package, the types inferred from these schemas play a crucial role. Exporting these types allows other parts of your application or even external applications to make requests while ensuring data consistency through type safety.

## Exporting Zod Types

Zod Schemas inherently define types that can be automatically inferred. By exporting these types, you provide a clear contract for the expected structure of data in requests and responses.

### Example

Consider a Zod Schema for parsing URL segments:

```typescript
import { z } from "zod";

// Define a Zod Schema for URL Segments
export const SegmentsSchema = z.object({
  id: z.string(),
  category: z.string().optional(),
});

// Export the inferred type
export type Segments = z.infer<typeof SegmentsSchema>;
```

In this example, `Segments` is the inferred type, and it can be exported for external use.

## Utilizing Zod Types in Requests

Once exported, these types can be utilized in other parts of your application, ensuring that requests adhere to the defined data structure.

### Example

Assuming the `Segments` type from the previous example is exported:

```typescript
import { Segments } from "@flare-city/core";

// Example usage in a function that makes a request
async function makeSegmentRequest(segments: Segments) {
  // Ensure that the provided segments match the expected structure
  // before making the request
  // Your request logic here
}
```

By using the exported `Segments` type, you achieve a level of confidence that the provided data conforms to the defined structure.

## Benefits of Type Safety

Exporting Zod types brings several benefits:

1. **Predictable Contracts:** External parts of the application or other applications can understand the expected structure of data.

2. **Type Inference:** TypeScript can automatically infer types from Zod Schemas, reducing the need for manual type annotations.

3. **Consistent Data:** Ensures that data passed in requests and responses is consistent and matches the defined schema.

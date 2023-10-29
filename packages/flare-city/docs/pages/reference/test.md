# `@flare-city/test`

## Overview

This package was crafted to streamline the testing process for Cloudflare Workers using the Vitest framework for any `@flare-city` application. This package is designed to enhance the developer experience by providing a set of utilities that simplify setup, writing, and execution of tests.

If you're looking for a more in depth description of the choices that were made to support integration testing in this framework, please consult the [Why Vitest](./why-vitest.md) documentation.

### Features

1. **WorkerTest Class** - The core of the package is the WorkerTest class. This utility class facilitates the interaction with Cloudflare Workers during tests. It offers a clean and convenient interface for making HTTP requests to your worker endpoints, allowing you to focus on writing meaningful test cases.
2. **Effortless Setup** - The package integrates seamlessly with the Vitest testing framework, requiring minimal configuration. A setup file included in the package ensures that your testing environment is ready for Cloudflare Worker testing without unnecessary complexity.
3. **Response Handling** - The WorkerTest.get method returns a promise with a structured response, including both the parsed JSON content and the raw Response object. This flexibility empowers developers to handle different aspects of the Cloudflare Worker response during testing.
4. **Leveraging Existing Tools** - The decision to build on established tools like Vitest reflects a commitment to efficiency, community support, and a positive developer experience. By avoiding the reinvention of the wheel, the package allows you to harness the power of well-established testing solutions.

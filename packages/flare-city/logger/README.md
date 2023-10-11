# `@flare-city/logger`

## Overview

The `@flare-city/logger` is a TypeScript class designed for logging in a Node.js / Cloudflare Workers / JS Edge Runtime environment. It provides flexible and customizable logging functionalities with support for different log levels and output formats. This documentation will guide you through understanding how the code works, how to use it, and provide examples.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Constructor Options](#constructor-options)
4. [Methods](#methods)
   - [setName](#setname)
   - [setLoggingType](#setloggingtype)
   - [log](#log)
   - [debug](#debug)
   - [info](#info)
   - [warn](#warn)
   - [error](#error)
   - [setLogLevel](#setloglevel)

## Installation

To use the `Logger` class in your project, you can include the provided TypeScript file. If you are using a package manager like npm or yarn, you can install it as follows:

```bash
npm install workers-logger
```

## Usage

```typescript
import { Logger, LogLevel, LoggingType } from "workers-logger";

// Create a new instance of Logger
const logger = new Logger({
  name: "MyLogger",
  level: "info",
  loggingType: "json",
});

// Log messages at different levels
logger.debug("This is a debug message", { additionalData: "some data" });
logger.info("This is an info message", { moreInfo: "additional info" });
logger.warn("This is a warning message", { warningDetails: "some details" });
logger.error("This is an error message", { errorDetails: "some details" });

// Change log level dynamically
logger.setLogLevel("debug");
```

## Constructor Options

When creating a new instance of `Logger`, you can provide the following options:

- `name` (optional): A string representing the name of the logger. Default is "Logger".
- `level` (optional): The initial log level. It can be "debug", "info", "warn", or "error". Default is "info".
- `loggingType` (optional): The output format for logs. It can be "simple" or "json". Default is "json".

## Methods

### `setName`

```typescript
setName(name: string): void
```

Sets the name of the logger dynamically.

### `setLoggingType`

```typescript
setLoggingType(loggingType: LoggingType): void
```

Sets the logging type dynamically. The logging type can be "simple" or "json".

### `log`

```typescript
log(level: LogLevel, message: string, data: Record<string, any>): void
```

Logs a message with the specified log level. The `data` parameter is an optional object for additional information.

### `debug`

```typescript
debug(message: string, data: Record<string, any>): void
```

Logs a debug message.

### `info`

```typescript
info(message: string, data: Record<string, any>): void
```

Logs an info message.

### `warn`

```typescript
warn(message: string, data: Record<string, any>): void
```

Logs a warning message.

### `error`

```typescript
error(message: string, data: Record<string, any>): void
```

Logs an error message.

### `setLogLevel`

```typescript
setLogLevel(level: LogLevel): void
```

Sets the log level dynamically. Valid log levels are "debug", "info", "warn", and "error". If an invalid level is provided, a warning will be logged.

## Examples

### Example 1: Basic Usage

```typescript
const logger = new Logger();

logger.info("Hello, Logger!");
```

### Example 2: Custom Name and Logging Type

```typescript
const logger = new Logger({
  name: "CustomLogger",
  loggingType: "simple",
});

logger.debug("This is a debug message.");
```

### Example 3: Dynamic Log Level

```typescript
const logger = new Logger();

logger.info("This will be logged.");

logger.setLogLevel("debug");

logger.debug("This will also be logged.");
```

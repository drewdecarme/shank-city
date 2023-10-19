import { log } from "./util.log";

class AppError extends Error {
  status_code: number;
  status_text: string;
  data?: Record<string, unknown>;

  constructor(params: {
    message: string;
    status_code: number;
    status_text: string;
    data?: Record<string, unknown>;
  }) {
    super(params.message);
    this.status_code = params.status_code;
    this.status_text = params.status_text;
    this.data = params.data || {};
  }
}

/**
 * Format's an error message and appends extra content onto
 * it if provided
 */
const formatErrorMessage = (prefix: string, message?: string) =>
  `${prefix}${message ? `: ${message}` : ""}`;

export class ErrorNotFound extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Not Found", message),
      status_code: 404,
      status_text: "Not Found",
    });
    this.name = "ErrorNotFound";
  }
}

export class ErrorServer extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Server Error", message),
      status_code: 500,
      status_text: "Server Error",
    });
    this.name = "ErrorServer";
  }
}

export class ErrorBadRequest extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Bad Request", message),
      status_code: 400,
      status_text: "Bad Request",
    });
    this.name = "ErrorBadRequest";
  }
}

export class ErrorUnauthorized extends AppError {
  constructor(message?: string) {
    super({
      message: formatErrorMessage("Unauthorized", message),
      status_code: 401,
      status_text: "Unauthorized",
    });
    this.name = "ErrorUnauthorized";
  }
}

export class ErrorValidation extends AppError {
  constructor(params: { message?: string; data?: Record<string, unknown> }) {
    super({
      message: formatErrorMessage("Invalid", params.message),
      status_code: 422,
      status_text: "Unprocessable Entity",
      data: params.data,
    });
    this.name = "ErrorValidation";
  }
}

export const errorHandler = (error: unknown) => {
  // if the error is handled then just throw the error
  if (
    error instanceof ErrorNotFound ||
    error instanceof ErrorUnauthorized ||
    error instanceof ErrorBadRequest ||
    error instanceof ErrorValidation ||
    error instanceof ErrorServer
  ) {
    log.error(error.message);

    return new Response(
      JSON.stringify({
        message: error.message,
        status_code: error.status_code,
        status_text: error.status_text,
        data: error.data,
      }),
      {
        status: error.status_code,
        statusText: error.status_text,
      }
    );
  }
  log.error(error as string);
  throw new Error("Internal Server Error: Unhandled.");
};

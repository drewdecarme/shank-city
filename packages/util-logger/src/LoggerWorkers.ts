interface WorkersLoggerOptions {
  name?: string;
  level?: string;
}

export class WorkersLogger {
  private name: string;
  private level: string;
  private logColors: Record<string, string>;
  private resetColor: string;

  constructor(options: WorkersLoggerOptions = {}) {
    const { name = "WorkersLogger", level = "info" } = options;
    this.name = name;
    this.level = level;
    this.logColors = {
      debug: "\x1b[90m", // Grey
      info: "\x1b[34m", // Blue
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    };
    this.resetColor = "\x1b[0m";

    this.setName(name);
  }

  setName(name: string): void {
    this.name = name;
  }

  log(level: string, message: string, data: Record<string, any> = {}): void {
    if (this.isLogLevelEnabled(level)) {
      const color = this.logColors[level] || "";
      const logMessage = JSON.stringify({
        level,
        name: this.name,
        message,
        timestamp: new Date().toISOString(),
        data,
      });

      console.log(`${color}${logMessage}${this.resetColor}`);
    }
  }

  private isLogLevelEnabled(level: string): boolean {
    const levels = ["debug", "info", "warn", "error"];

    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  debug(message: string, data: Record<string, any> = {}): void {
    this.log("debug", message, data);
  }

  info(message: string, data: Record<string, any> = {}): void {
    this.log("info", message, data);
  }

  warn(message: string, data: Record<string, any> = {}): void {
    this.log("warn", message, data);
  }

  error(message: string, data: Record<string, any> = {}): void {
    this.log("error", message, data);
  }

  // Function to set the log level dynamically
  setLogLevel(level: string): void {
    if (["debug", "info", "warn", "error"].includes(level)) {
      this.level = level;
    } else {
      console.warn(
        "Invalid log level. Allowed levels are debug, info, warn, and error."
      );
    }
  }
}

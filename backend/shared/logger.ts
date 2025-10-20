// 简单的日志工具

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  debug(message: string, ...args: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: any[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }

  logRequest(request: Request, startTime: number) {
    const duration = Date.now() - startTime;
    const method = request.method;
    const url = new URL(request.url);
    this.info(`${method} ${url.pathname} - ${duration}ms`);
  }
}

declare const __ENV_NODE_ENV__: string | undefined;
const runtimeNodeEnv = (typeof __ENV_NODE_ENV__ !== 'undefined') ? __ENV_NODE_ENV__ : 'production';
export const logger = new Logger(
  runtimeNodeEnv === 'production' ? LogLevel.INFO : LogLevel.DEBUG
);


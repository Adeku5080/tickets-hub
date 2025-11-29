// src/logger/base.logger.ts
import * as winston from 'winston';
const { combine, label, timestamp, printf } = winston.format;

// Fallback APP_NAME if constant import fails
const APP_NAME = process.env.APP_NAME || 'my-app';

// Import telemetry utilities
let telemetryLogger: any = null;


export class BaseLogger {
  private readonly LOG_FILE = {
    ERROR: 'logs/error.log',
    WARN: 'logs/warn.log',
    INFO: 'logs/info.log',
    DEBUG: 'logs/debug.log',
    ALL: 'logs/all.log',
  };

  // 🟡 Cache for singleton logger instances by context
  private static loggerCache = new Map<string, winston.Logger>();

  // Method to set telemetry logger after initialization
  static setTelemetryLogger(logger: any) {
    telemetryLogger = logger;
  }

  protected createLogger(context: string): winston.Logger {
    if (BaseLogger.loggerCache.has(context)) {
      const cachedLogger = BaseLogger.loggerCache.get(context);
      if (cachedLogger) {
        return cachedLogger;
      }
      throw new Error(
        `Logger instance for context "${context}" not found in cache.`,
      );
    }

    const labelName = `${APP_NAME}::${context}`;
    const logFormat = printf(({ message, label, level, timestamp }) => {
      return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
    });

    // Create custom telemetry transport
    const telemetryTransport = new winston.transports.Console({
      format: winston.format.printf((info) => {
        if (telemetryLogger) {
          try {
            // Convert Winston level to OpenTelemetry severity
            const severityMap: { [key: string]: number } = {
              error: 17, // ERROR
              warn: 13, // WARN
              info: 9, // INFO
              debug: 5, // DEBUG
            };

            telemetryLogger.emit({
              severityNumber: severityMap[info.level] || 9,
              severityText: info.level.toUpperCase(),
              body: info.message,
              attributes: {
                logger: 'winston',
                context: context,
                app_name: APP_NAME,
                timestamp: info.timestamp,
                label: info.label,
              },
            });
          } catch (error) {
            // Fallback to console if telemetry fails
            console.error('Telemetry logging failed:', error);
          }
        }
        return `${info.timestamp} [${
          info.label
        }] ${info.level.toUpperCase()}: ${info.message}`;
      }),
    });

    const logger = winston.createLogger({
      level: 'info',
      format: combine(label({ label: labelName }), timestamp(), logFormat),
      transports: [
        new winston.transports.Console({
          level: 'debug',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.ERROR,
          level: 'error',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.WARN,
          level: 'warn',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.ALL,
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.DEBUG,
          level: 'debug',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.INFO,
          level: 'info',
        }),
        // Add telemetry transport if available
        ...(telemetryLogger ? [telemetryTransport] : []),
      ],
      exitOnError: false,
    });

    BaseLogger.loggerCache.set(context, logger);
    return logger;
  }
}

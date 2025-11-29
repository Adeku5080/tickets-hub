import { BaseLogger } from './base.logger';
import { Logger as WinstonLogger } from 'winston';
import { LogPayload } from './logger.interface';

export class ContextLogger extends BaseLogger {
  private logger: WinstonLogger;
  private requestId?: string;

  constructor(context: string) {
    super();
    this.logger = this.createLogger(context);
  }

  setRequestId(id: string) {
    this.requestId = id;
  }

  private formatData(
    message: string,
    description?: string,
    functionName?: string,
    statusCode?: number,
  ) {
    const environment = process.env.NODE_ENV || 'development';
    return {
      message,
      requestId: this.requestId,
      description,
      functionName,
      statusCode,
      environment,
    };
  }

  private logLevel(
    level: 'warn' | 'info' | 'error' | 'debug',
    payload: LogPayload,
  ) {
    const { message, description, functionName, statusCode } = payload;
    this.logger[level](
      JSON.stringify(
        this.formatData(message, description, functionName, statusCode),
      ),
    );
  }

  info(payload: LogPayload) {
    this.logLevel('info', payload);
  }

  warn(payload: LogPayload) {
    this.logLevel('warn', payload);
  }

  error(payload: LogPayload) {
    this.logLevel('error', payload);
  }

  debug(payload: LogPayload) {
    this.logLevel('debug', payload);
  }
}

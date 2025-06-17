import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ILoggerService } from '../interfaces/service.interface';

@Injectable()
export class LoggerService implements ILoggerService, NestLoggerService {
  private static instance: LoggerService;

  constructor() {
    // For dependency injection compatibility
    if (!LoggerService.instance) {
      LoggerService.instance = this;
    }
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  log(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.log(`${timestamp} ${contextStr} ${message}`);
  }

  error(message: string, error?: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.error(`${timestamp} ${contextStr} ERROR: ${message}`, error || '');
  }

  warn(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.warn(`${timestamp} ${contextStr} WARN: ${message}`);
  }

  debug(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.debug(`${timestamp} ${contextStr} DEBUG: ${message}`);
  }
}

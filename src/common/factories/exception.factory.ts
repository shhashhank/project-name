import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

export enum ExceptionType {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface ExceptionOptions {
  message: string;
  context?: string;
  error?: any;
}

export class ExceptionFactory {
  static create(type: ExceptionType, options: ExceptionOptions): Error {
    const { message, context, error } = options;
    const contextMessage = context ? `[${context}] ` : '';

    switch (type) {
      case ExceptionType.NOT_FOUND:
        return new NotFoundException(`${contextMessage}${message}`);
      
      case ExceptionType.BAD_REQUEST:
        return new BadRequestException(`${contextMessage}${message}`);
      
      case ExceptionType.VALIDATION_ERROR:
        return new BadRequestException(`${contextMessage}${message}`);
      
      case ExceptionType.INTERNAL_SERVER_ERROR:
        return new InternalServerErrorException(`${contextMessage}${message}`);
      
      default:
        return new InternalServerErrorException(`${contextMessage}${message}`);
    }
  }

  static notFound(message: string, context?: string): NotFoundException {
    return this.create(ExceptionType.NOT_FOUND, { message, context }) as NotFoundException;
  }

  static badRequest(message: string, context?: string): BadRequestException {
    return this.create(ExceptionType.BAD_REQUEST, { message, context }) as BadRequestException;
  }

  static validationError(message: string, context?: string): BadRequestException {
    return this.create(ExceptionType.VALIDATION_ERROR, { message, context }) as BadRequestException;
  }

  static internalServerError(message: string, context?: string, error?: any): InternalServerErrorException {
    return this.create(ExceptionType.INTERNAL_SERVER_ERROR, { message, context, error }) as InternalServerErrorException;
  }
} 
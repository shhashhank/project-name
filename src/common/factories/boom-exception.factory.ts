import * as Boom from '@hapi/boom';

export enum BoomErrorType {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface BoomExceptionOptions {
  message: string;
  context?: string;
  error?: any;
  data?: any;
  headers?: Record<string, string>;
}

export class BoomExceptionFactory {
  static create(type: BoomErrorType, options: BoomExceptionOptions): Boom.Boom {
    const { message, context, error, data, headers } = options;
    const contextMessage = context ? `[${context}] ` : '';
    const fullMessage = `${contextMessage}${message}`;

    let boomError: Boom.Boom;

    switch (type) {
      case BoomErrorType.BAD_REQUEST:
        boomError = Boom.badRequest(fullMessage, data);
        break;
      
      case BoomErrorType.UNAUTHORIZED:
        boomError = Boom.unauthorized(fullMessage, data);
        break;
      
      case BoomErrorType.FORBIDDEN:
        boomError = Boom.forbidden(fullMessage, data);
        break;
      
      case BoomErrorType.NOT_FOUND:
        boomError = Boom.notFound(fullMessage, data);
        break;
      
      case BoomErrorType.CONFLICT:
        boomError = Boom.conflict(fullMessage, data);
        break;
      
      case BoomErrorType.UNPROCESSABLE_ENTITY:
        boomError = Boom.badData(fullMessage, data);
        break;
      
      case BoomErrorType.TOO_MANY_REQUESTS:
        boomError = Boom.tooManyRequests(fullMessage, data);
        break;
      
      case BoomErrorType.INTERNAL_SERVER_ERROR:
        boomError = Boom.internal(fullMessage, data);
        break;
      
      case BoomErrorType.BAD_GATEWAY:
        boomError = Boom.badGateway(fullMessage, data);
        break;
      
      case BoomErrorType.SERVICE_UNAVAILABLE:
        boomError = Boom.serverUnavailable(fullMessage, data);
        break;
      
      default:
        boomError = Boom.internal(fullMessage, data);
    }

    // Add custom headers if provided
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        boomError.output.headers[key] = value;
      });
    }

    // Add original error if provided
    if (error) {
      (boomError as any).originalError = error;
    }

    return boomError;
  }

  // Convenience methods for common error types
  static badRequest(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.BAD_REQUEST, { message, context, data });
  }

  static unauthorized(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.UNAUTHORIZED, { message, context, data });
  }

  static forbidden(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.FORBIDDEN, { message, context, data });
  }

  static notFound(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.NOT_FOUND, { message, context, data });
  }

  static conflict(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.CONFLICT, { message, context, data });
  }

  static unprocessableEntity(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.UNPROCESSABLE_ENTITY, { message, context, data });
  }

  static tooManyRequests(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.TOO_MANY_REQUESTS, { message, context, data });
  }

  static internalServerError(message: string, context?: string, error?: any, data?: any): Boom.Boom {
    return this.create(BoomErrorType.INTERNAL_SERVER_ERROR, { message, context, error, data });
  }

  static badGateway(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.BAD_GATEWAY, { message, context, data });
  }

  static serviceUnavailable(message: string, context?: string, data?: any): Boom.Boom {
    return this.create(BoomErrorType.SERVICE_UNAVAILABLE, { message, context, data });
  }

  // Validation specific errors
  static validationError(message: string, context?: string, validationErrors?: any): Boom.Boom {
    return this.unprocessableEntity(message, context, { validationErrors });
  }

  // Database specific errors
  static databaseError(message: string, context?: string, error?: any): Boom.Boom {
    return this.internalServerError(message, context, error, { type: 'database_error' });
  }

  // Authentication specific errors
  static authenticationError(message: string, context?: string, data?: any): Boom.Boom {
    return this.unauthorized(message, context, { ...data, type: 'authentication_error' });
  }

  // Authorization specific errors
  static authorizationError(message: string, context?: string, data?: any): Boom.Boom {
    return this.forbidden(message, context, { ...data, type: 'authorization_error' });
  }
} 
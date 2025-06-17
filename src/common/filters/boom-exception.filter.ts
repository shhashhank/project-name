import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Boom from '@hapi/boom';

@Catch()
export class BoomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorData: unknown = null;

    // Handle Boom errors
    if (Boom.isBoom(exception)) {
      const boomError = exception;
      status = boomError.output.statusCode;
      message = boomError.message;
      errorData = boomError.data || null;

      // Add Boom headers to response
      if (boomError.output.headers) {
        Object.entries(boomError.output.headers).forEach(
          ([key, value]: [string, unknown]) => {
            response.header(key, value?.toString());
          },
        );
      }
    }
    // Handle NestJS HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        errorData = exceptionResponse;
      }
    }
    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message;
      errorData = {
        name: exception.name,
        stack:
          process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      };
    }

    // Create standardized error response
    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      message,
      error: this.getErrorType(status),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (errorData) {
      errorResponse.data = errorData as Record<string, unknown>;
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception caught by BoomExceptionFilter:', {
        exception,
        request: {
          method: request.method,
          url: request.url,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          body: request.body,
          params: request.params,
          query: request.query,
        },
        response: errorResponse,
      } as Record<string, unknown>);
    }

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      default:
        return 'Internal Server Error';
    }
  }
}

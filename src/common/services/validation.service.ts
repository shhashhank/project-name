import { Injectable } from '@nestjs/common';
import { BoomExceptionFactory } from '../factories/boom-exception.factory';

export interface ValidationStrategy {
  validate(value: any): boolean;
  getErrorMessage(): string;
}

export class UUIDValidationStrategy implements ValidationStrategy {
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  validate(value: string): boolean {
    return this.uuidRegex.test(value);
  }

  getErrorMessage(): string {
    return 'Invalid UUID format';
  }
}

export class PriceValidationStrategy implements ValidationStrategy {
  validate(value: number): boolean {
    return typeof value === 'number' && value >= 0;
  }

  getErrorMessage(): string {
    return 'Price must be a non-negative number';
  }
}

export class StockValidationStrategy implements ValidationStrategy {
  validate(value: number): boolean {
    return typeof value === 'number' && value >= 0 && Number.isInteger(value);
  }

  getErrorMessage(): string {
    return 'Stock must be a non-negative integer';
  }
}

@Injectable()
export class ValidationService {
  private strategies: Map<string, ValidationStrategy> = new Map();

  constructor() {
    this.strategies.set('uuid', new UUIDValidationStrategy());
    this.strategies.set('price', new PriceValidationStrategy());
    this.strategies.set('stock', new StockValidationStrategy());
  }

  validate(value: any, strategyName: string, context?: string): void {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      throw BoomExceptionFactory.internalServerError(
        `Validation strategy '${strategyName}' not found`,
        context
      );
    }

    if (!strategy.validate(value)) {
      throw BoomExceptionFactory.validationError(
        strategy.getErrorMessage(),
        context
      );
    }
  }

  validateUUID(uuid: string, context?: string): void {
    this.validate(uuid, 'uuid', context);
  }

  validatePrice(price: number, context?: string): void {
    this.validate(price, 'price', context);
  }

  validateStock(stock: number, context?: string): void {
    this.validate(stock, 'stock', context);
  }

  addStrategy(name: string, strategy: ValidationStrategy): void {
    this.strategies.set(name, strategy);
  }
} 
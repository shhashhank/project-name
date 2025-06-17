import { Model, ModelStatic } from 'sequelize';
import * as Boom from '@hapi/boom';
import { IRepository } from '../interfaces/repository.interface';
import { LoggerService } from '../services/logger.service';
import { BoomExceptionFactory } from '../factories/boom-exception.factory';

export abstract class BaseRepository<T extends Model> implements IRepository<T> {
  protected readonly logger = LoggerService.getInstance();

  constructor(protected readonly model: ModelStatic<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const result = await this.model.create(data as any);
      this.logger.log(`Created ${this.model.name} with ID: ${result.get('id')}`, this.constructor.name);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create ${this.model.name}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to create ${this.model.name}`,
        this.constructor.name,
        error
      );
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findByPk(id);
      if (!result) {
        this.logger.warn(`${this.model.name} with ID ${id} not found`, this.constructor.name);
      }
      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${this.model.name} by ID: ${id}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to find ${this.model.name} by ID: ${id}`,
        this.constructor.name,
        error
      );
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const results = await this.model.findAll();
      this.logger.log(`Found ${results.length} ${this.model.name} records`, this.constructor.name);
      return results;
    } catch (error) {
      this.logger.error(`Failed to find all ${this.model.name}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to find all ${this.model.name}`,
        this.constructor.name,
        error
      );
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const instance = await this.findById(id);
      if (!instance) {
        throw BoomExceptionFactory.notFound(
          `${this.model.name} with ID ${id} not found`,
          this.constructor.name
        );
      }
      
      await instance.update(data as any);
      this.logger.log(`Updated ${this.model.name} with ID: ${id}`, this.constructor.name);
      return instance;
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw error;
      }
      this.logger.error(`Failed to update ${this.model.name} with ID: ${id}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to update ${this.model.name} with ID: ${id}`,
        this.constructor.name,
        error
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const instance = await this.findById(id);
      if (!instance) {
        throw BoomExceptionFactory.notFound(
          `${this.model.name} with ID ${id} not found`,
          this.constructor.name
        );
      }
      
      await instance.destroy();
      this.logger.log(`Deleted ${this.model.name} with ID: ${id}`, this.constructor.name);
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw error;
      }
      this.logger.error(`Failed to delete ${this.model.name} with ID: ${id}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to delete ${this.model.name} with ID: ${id}`,
        this.constructor.name,
        error
      );
    }
  }

  async findByIds(ids: string[]): Promise<T[]> {
    try {
      const results = await this.model.findAll({
        where: { id: ids } as any,
      });
      this.logger.log(`Found ${results.length} ${this.model.name} records by IDs`, this.constructor.name);
      return results;
    } catch (error) {
      this.logger.error(`Failed to find ${this.model.name} by IDs`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to find ${this.model.name} by IDs`,
        this.constructor.name,
        error
      );
    }
  }

  // Template method for custom queries
  protected async executeQuery(query: any): Promise<T[]> {
    try {
      const results = await this.model.findAll(query);
      this.logger.log(`Executed custom query on ${this.model.name}`, this.constructor.name);
      return results;
    } catch (error) {
      this.logger.error(`Failed to execute custom query on ${this.model.name}`, error, this.constructor.name);
      throw BoomExceptionFactory.databaseError(
        `Failed to execute custom query on ${this.model.name}`,
        this.constructor.name,
        error
      );
    }
  }
} 
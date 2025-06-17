import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { IProductService as IBaseProductService } from '../../../common/interfaces/service.interface';
import { IProductService } from '../interfaces/product-service.interface';
import { ProductRepository } from '../repositories/product.repository';
import { ValidationService } from '../../../common/services/validation.service';
import { BoomExceptionFactory } from '../../../common/factories/boom-exception.factory';
import { LoggerService } from '../../../common/services/logger.service';

@Injectable()
export class ProductsService implements IBaseProductService, IProductService {
  private readonly logger = LoggerService.getInstance();

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly validationService: ValidationService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Validate input data
      this.validationService.validatePrice(createProductDto.price, 'ProductsService.createProduct');
      this.validationService.validateStock(createProductDto.stock, 'ProductsService.createProduct');

      const product = await this.productRepository.create({
        ...createProductDto,
        isActive: createProductDto.isActive ?? true,
      });

      this.logger.log(`Product created successfully: ${product.get('name')}`, 'ProductsService');
      return product;
    } catch (error) {
      this.logger.error('Failed to create product', error, 'ProductsService.createProduct');
      throw BoomExceptionFactory.badRequest('Failed to create product', 'ProductsService');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productRepository.findActiveProducts();
      this.logger.log(`Retrieved ${products.length} active products`, 'ProductsService');
      return products;
    } catch (error) {
      this.logger.error('Failed to fetch products', error, 'ProductsService.getAllProducts');
      throw BoomExceptionFactory.badRequest('Failed to fetch products', 'ProductsService');
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      this.validationService.validateUUID(id, 'ProductsService.getProductById');
      
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw BoomExceptionFactory.notFound(`Product with ID ${id} not found`, 'ProductsService');
      }

      this.logger.log(`Retrieved product: ${product.get('name')}`, 'ProductsService');
      return product;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      this.logger.error(`Failed to fetch product with ID: ${id}`, error, 'ProductsService.getProductById');
      throw BoomExceptionFactory.badRequest('Failed to fetch product', 'ProductsService');
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      this.validationService.validateUUID(id, 'ProductsService.updateProduct');
      
      if (updateProductDto.price !== undefined) {
        this.validationService.validatePrice(updateProductDto.price, 'ProductsService.updateProduct');
      }
      if (updateProductDto.stock !== undefined) {
        this.validationService.validateStock(updateProductDto.stock, 'ProductsService.updateProduct');
      }

      const product = await this.productRepository.update(id, updateProductDto);
      this.logger.log(`Product updated successfully: ${product.get('name')}`, 'ProductsService');
      return product;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      this.logger.error(`Failed to update product with ID: ${id}`, error, 'ProductsService.updateProduct');
      throw BoomExceptionFactory.badRequest('Failed to update product', 'ProductsService');
    }
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      this.validationService.validateUUID(id, 'ProductsService.deleteProduct');
      
      await this.productRepository.delete(id);
      const message = `Product with ID ${id} deleted successfully`;
      this.logger.log(message, 'ProductsService');
      return { message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      this.logger.error(`Failed to delete product with ID: ${id}`, error, 'ProductsService.deleteProduct');
      throw BoomExceptionFactory.badRequest('Failed to delete product', 'ProductsService');
    }
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    try {
      // Validate all UUIDs
      ids.forEach(id => this.validationService.validateUUID(id, 'ProductsService.getProductsByIds'));
      
      const products = await this.productRepository.findByIds(ids);
      this.logger.log(`Retrieved ${products.length} products by IDs`, 'ProductsService');
      return products;
    } catch (error) {
      this.logger.error('Failed to fetch products by IDs', error, 'ProductsService.getProductsByIds');
      throw BoomExceptionFactory.badRequest('Failed to fetch products', 'ProductsService');
    }
  }

  // Additional business logic methods
  async findProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      this.validationService.validatePrice(minPrice, 'ProductsService.findProductsByPriceRange');
      this.validationService.validatePrice(maxPrice, 'ProductsService.findProductsByPriceRange');
      
      if (minPrice > maxPrice) {
        throw BoomExceptionFactory.badRequest('Min price cannot be greater than max price', 'ProductsService');
      }

      const products = await this.productRepository.findProductsByPriceRange(minPrice, maxPrice);
      this.logger.log(`Found ${products.length} products in price range ${minPrice}-${maxPrice}`, 'ProductsService');
      return products;
    } catch (error) {
      this.logger.error('Failed to find products by price range', error, 'ProductsService.findProductsByPriceRange');
      throw BoomExceptionFactory.badRequest('Failed to find products by price range', 'ProductsService');
    }
  }

  async findLowStockProducts(threshold: number = 10): Promise<Product[]> {
    try {
      this.validationService.validateStock(threshold, 'ProductsService.findLowStockProducts');
      
      const products = await this.productRepository.findLowStockProducts(threshold);
      this.logger.log(`Found ${products.length} products with low stock (≤${threshold})`, 'ProductsService');
      return products;
    } catch (error) {
      this.logger.error('Failed to find low stock products', error, 'ProductsService.findLowStockProducts');
      throw BoomExceptionFactory.badRequest('Failed to find low stock products', 'ProductsService');
    }
  }

  // Implementation for IProductService interface
  async findById(id: string): Promise<Product | null> {
    try {
      this.validationService.validateUUID(id, 'ProductsService.findById');
      return await this.productRepository.findById(id);
    } catch (error) {
      this.logger.error(`Failed to find product with ID: ${id}`, error, 'ProductsService.findById');
      return null;
    }
  }

  async updateStock(productId: string, quantityChange: number): Promise<Product> {
    try {
      this.validationService.validateUUID(productId, 'ProductsService.updateStock');
      
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw BoomExceptionFactory.notFound(`Product with ID ${productId} not found`, 'ProductsService.updateStock');
      }

      const newStock = product.stock + quantityChange;
      if (newStock < 0) {
        throw BoomExceptionFactory.badRequest(
          `Cannot reduce stock below 0. Current: ${product.stock}, Change: ${quantityChange}`,
          'ProductsService.updateStock'
        );
      }

      const updatedProduct = await this.productRepository.update(productId, { stock: newStock });
      this.logger.log(`Stock updated for product ${productId}: ${product.stock} → ${newStock}`, 'ProductsService');
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update stock for product ${productId}`, error, 'ProductsService.updateStock');
      throw error;
    }
  }
} 
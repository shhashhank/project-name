import { CreateProductDto, UpdateProductDto } from '../../modules/products/dto';
import { Product } from '../../modules/products/entities/product.entity';

export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';

export interface IProductService {
  createProduct(createProductDto: CreateProductDto): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product>;
  deleteProduct(id: string): Promise<{ message: string }>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  findProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]>;
  findLowStockProducts(threshold?: number): Promise<Product[]>;
}

export interface ILoggerService {
  log(message: string, context?: string): void;
  error(message: string, error?: any, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}

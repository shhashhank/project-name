import { Product } from '../entities/product.entity';

export interface IProductService {
  findById(id: string): Promise<Product | null>;
  updateStock(productId: string, quantityChange: number): Promise<Product>;
} 
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from '../entities/product.entity';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {
    super(productModel);
  }

  async findActiveProducts(): Promise<Product[]> {
    return this.executeQuery({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  async findProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.executeQuery({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
        isActive: true,
      },
    });
  }

  async findProductsByName(name: string): Promise<Product[]> {
    return this.executeQuery({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
        isActive: true,
      },
    });
  }

  async findLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return this.executeQuery({
      where: {
        stock: {
          [Op.lte]: threshold,
        },
        isActive: true,
      },
    });
  }
} 
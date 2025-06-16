import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.create({
        ...createProductDto,
        isActive: createProductDto.isActive ?? true,
      });
      console.log(`Product created successfully: ${product.dataValues.name}`);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productModel.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new BadRequestException('Failed to fetch products');
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching product:', error);
      throw new BadRequestException('Failed to fetch product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      await product.update(updateProductDto);
      console.log(`Product ${id} updated successfully`);
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating product:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      await product.destroy();
      console.log(`Product ${id} deleted successfully`);
      return { message: `Product with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting product:', error);
      throw new BadRequestException('Failed to delete product');
    }
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    try {
      const products = await this.productModel.findAll({
        where: {
          id: ids,
          isActive: true,
        },
      });
      return products;
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw new BadRequestException('Failed to fetch products');
    }
  }
} 
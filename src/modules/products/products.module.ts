import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';
import { PRODUCT_SERVICE } from '../../common/interfaces/service.interface';
// import { IProductService } from './interfaces/product-service.interface';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    {
      provide: PRODUCT_SERVICE,
      useClass: ProductsService, // Dependency injection configuration
    },
    {
      provide: 'IProductService',
      useClass: ProductsService,
    },
  ],
  exports: [ProductsService, ProductRepository, PRODUCT_SERVICE, 'IProductService'],
})
export class ProductsModule {} 
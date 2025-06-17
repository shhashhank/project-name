import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './modules/products/products.module';
import { CommonModule } from './common/common.module';
import { databaseConfig } from './config/database.config';
import { Product } from './modules/products/entities/product.entity';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...databaseConfig,
      models: [Product, Order, OrderItem],
    }),
    CommonModule,
    ProductsModule,
  ],
})
export class AppModule {}

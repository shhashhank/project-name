import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from '../entities/order-item.entity';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor(
    @InjectModel(OrderItem)
    orderItemModel: typeof OrderItem,
  ) {
    super(orderItemModel);
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.executeQuery({
      where: { orderId },
      include: ['product'],
    });
  }

  async findByProductId(productId: string): Promise<OrderItem[]> {
    return this.executeQuery({
      where: { productId },
      include: ['order'],
    });
  }

  async getOrderTotal(orderId: string): Promise<number> {
    if (!this.model.sequelize) {
      throw new Error('Sequelize instance not available');
    }

    const result = await this.executeQuery({
      where: { orderId },
      attributes: [
        [
          this.model.sequelize.fn(
            'SUM',
            this.model.sequelize.col('totalPrice'),
          ),
          'total',
        ],
      ],
      raw: true,
    });
    return parseFloat((result[0] as any)?.total || '0');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Order } from '../entities/order.entity';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { QueryOrderDto } from '../dto/query-order.dto';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectModel(Order)
    orderModel: typeof Order,
  ) {
    super(orderModel);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await this.executeQuery({
      where: { orderNumber },
      limit: 1,
    });
    return result[0] || null;
  }

  async findByCustomerEmail(email: string): Promise<Order[]> {
    return this.executeQuery({
      where: { customerEmail: email },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.executeQuery({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
  }

  async findWithFilters(
    query: QueryOrderDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      customerEmail,
      customerName,
      orderNumber,
    } = query;
    const offset = (page - 1) * limit;

    if (!this.model.sequelize) {
      throw new Error('Sequelize instance not available');
    }

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (customerEmail)
      whereClause.customerEmail = { [Op.iLike]: `%${customerEmail}%` };
    if (customerName)
      whereClause.customerName = { [Op.iLike]: `%${customerName}%` };
    if (orderNumber)
      whereClause.orderNumber = { [Op.iLike]: `%${orderNumber}%` };

    const [orders, total] = await Promise.all([
      this.executeQuery({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      }),
      this.executeQuery({
        where: whereClause,
        attributes: [
          [
            this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')),
            'count',
          ],
        ],
        raw: true,
      }),
    ]);

    return {
      orders,
      total: (total[0] as any)?.count || 0,
    };
  }

  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    if (!this.model.sequelize) {
      throw new Error('Sequelize instance not available');
    }

    const stats = await this.executeQuery({
      attributes: [
        'status',
        [
          this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')),
          'count',
        ],
      ],
      group: ['status'],
      raw: true,
    });

    const result = {
      total: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    stats.forEach((stat: any) => {
      const count = parseInt(stat.count);
      result.total += count;
      if (stat.status in result) {
        result[stat.status as keyof typeof result] = count;
      }
    });

    return result;
  }
}

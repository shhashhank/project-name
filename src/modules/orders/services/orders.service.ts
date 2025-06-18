import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../entities/order.entity';
// import { OrderItem } from '../entities/order-item.entity';
// import { Product } from '../../products/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { QueryOrderDto } from '../dto/query-order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { IProductService } from '../../products/interfaces/product-service.interface';
import { BoomExceptionFactory } from '../../../common/factories/boom-exception.factory';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    @Inject('IProductService') private readonly productService: IProductService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<ApiResponseDto<Order>> {
    const { items, ...orderData } = createOrderDto;

    // Validate products and calculate totals
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productService.findById(item.productId);
      if (!product) {
        throw BoomExceptionFactory.notFound(
          `Product with ID ${item.productId} not found`,
          'OrdersService.createOrder',
        );
      }

      if (product.stock < item.quantity) {
        throw BoomExceptionFactory.badRequest(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          'OrdersService.createOrder',
        );
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = await this.orderRepository.create({
      ...orderData,
      orderNumber,
      totalAmount,
      status: 'pending',
    });

    // Create order items
    await Promise.all(
      orderItems.map((item) =>
        this.orderItemRepository.create({
          ...item,
          orderId: order.id,
        }),
      ),
    );

    // Update product stock
    await Promise.all(
      orderItems.map((item) =>
        this.productService.updateStock(item.productId, -item.quantity),
      ),
    );

    return new ApiResponseDto(true, 'Order created successfully', order);
  }

  async findAll(
    query: QueryOrderDto,
  ): Promise<ApiResponseDto<{ orders: Order[]; pagination: any }>> {
    const { orders, total } = await this.orderRepository.findWithFilters(query);
    const { page = 1, limit = 10 } = query;
    const totalPages = Math.ceil(total / limit);

    return new ApiResponseDto(true, 'Orders retrieved successfully', {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }

  async findById(id: string): Promise<ApiResponseDto<Order>> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw BoomExceptionFactory.notFound(
        `Order with ID ${id} not found`,
        'OrdersService.findById',
      );
    }

    const orderItems = await this.orderItemRepository.findByOrderId(id);
    const orderWithItems = { ...order.toJSON(), items: orderItems };

    return new ApiResponseDto(
      true,
      'Order retrieved successfully',
      orderWithItems,
    );
  }

  async findByOrderNumber(orderNumber: string): Promise<ApiResponseDto<Order>> {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw BoomExceptionFactory.notFound(
        `Order with number ${orderNumber} not found`,
        'OrdersService.findByOrderNumber',
      );
    }

    const orderItems = await this.orderItemRepository.findByOrderId(order.id);
    const orderWithItems = { ...order.toJSON(), items: orderItems };

    return new ApiResponseDto(
      true,
      'Order retrieved successfully',
      orderWithItems,
    );
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ApiResponseDto<Order>> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw BoomExceptionFactory.notFound(
        `Order with ID ${id} not found`,
        'OrdersService.updateOrder',
      );
    }

    // If cancelling order, restore product stock
    if (updateOrderDto.status === 'cancelled' && order.status !== 'cancelled') {
      const orderItems = await this.orderItemRepository.findByOrderId(id);
      await Promise.all(
        orderItems.map((item) =>
          this.productService.updateStock(item.productId, item.quantity),
        ),
      );
    }

    const updatedOrder = await this.orderRepository.update(id, {
      ...updateOrderDto,
      ...(updateOrderDto.status === 'cancelled'
        ? { cancelledAt: new Date() }
        : {}),
    });

    return new ApiResponseDto(true, 'Order updated successfully', updatedOrder);
  }

  async deleteOrder(id: string): Promise<ApiResponseDto<void>> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw BoomExceptionFactory.notFound(
        `Order with ID ${id} not found`,
        'OrdersService.deleteOrder',
      );
    }

    // Restore product stock if order is not cancelled
    if (order.status !== 'cancelled') {
      const orderItems = await this.orderItemRepository.findByOrderId(id);
      await Promise.all(
        orderItems.map((item) =>
          this.productService.updateStock(item.productId, item.quantity),
        ),
      );
    }

    // Delete order items first
    await this.orderItemRepository.deleteByCondition({ orderId: id });

    // Delete order
    await this.orderRepository.delete(id);

    return new ApiResponseDto(true, 'Order deleted successfully');
  }

  async getOrderStats(): Promise<ApiResponseDto<any>> {
    const stats = await this.orderRepository.getOrderStats();
    return new ApiResponseDto(
      true,
      'Order statistics retrieved successfully',
      stats,
    );
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

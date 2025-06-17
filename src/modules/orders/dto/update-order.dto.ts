import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateOrderDto {
  @ApiProperty({ description: 'Order status', enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  declare status?: OrderStatus;

  @ApiProperty({ description: 'Customer email', required: false })
  @IsEmail()
  @IsOptional()
  declare customerEmail?: string;

  @ApiProperty({ description: 'Customer name', required: false })
  @IsString()
  @IsOptional()
  declare customerName?: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsString()
  @IsOptional()
  declare shippingAddress?: string;
} 
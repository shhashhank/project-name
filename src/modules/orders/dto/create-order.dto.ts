import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsArray, IsNumber, IsOptional, ValidateNested, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  declare productId: string;

  @ApiProperty({ description: 'Quantity of the product', minimum: 1 })
  @IsNumber()
  @Min(1)
  declare quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer email' })
  @IsEmail()
  declare customerEmail: string;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  declare customerName: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsString()
  @IsOptional()
  declare shippingAddress?: string;

  @ApiProperty({ description: 'Order items', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  declare items: CreateOrderItemDto[];
} 
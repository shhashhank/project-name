import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from './update-order.dto';

export class QueryOrderDto {
  @ApiProperty({
    description: 'Order status filter',
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  declare status?: OrderStatus;

  @ApiProperty({ description: 'Customer email filter', required: false })
  @IsString()
  @IsOptional()
  declare customerEmail?: string;

  @ApiProperty({ description: 'Customer name filter', required: false })
  @IsString()
  @IsOptional()
  declare customerName?: string;

  @ApiProperty({ description: 'Order number filter', required: false })
  @IsString()
  @IsOptional()
  declare orderNumber?: string;

  @ApiProperty({
    description: 'Page number',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  declare page?: number;

  @ApiProperty({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  declare limit?: number;
}

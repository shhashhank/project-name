import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', example: 'iPhone 15 Pro', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Product description', example: 'Latest iPhone Pro model', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product price', example: 1199.99, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Product stock quantity', example: 50, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ description: 'Product active status', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 
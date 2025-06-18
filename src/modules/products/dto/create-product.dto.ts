import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'iPhone 15' })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone model',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare description?: string;

  @ApiProperty({ description: 'Product price', example: 999.99 })
  @IsNumber()
  @Min(0)
  declare price: number;

  @ApiProperty({ description: 'Product stock quantity', example: 100 })
  @IsNumber()
  @Min(0)
  declare stock: number;

  @ApiProperty({
    description: 'Product active status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  declare isActive?: boolean;
}

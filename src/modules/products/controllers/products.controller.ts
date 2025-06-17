import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  Inject
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities/product.entity';
import { IProductService, PRODUCT_SERVICE } from '../../../common/interfaces/service.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productsService: IProductService, // Dependency on interface, not concrete class
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: [Product] })
  @ApiResponse({ status: 400, description: 'Failed to fetch products' })
  findAll(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by price range' })
  @ApiQuery({ name: 'minPrice', type: 'number', required: true })
  @ApiQuery({ name: 'maxPrice', type: 'number', required: true })
  @ApiResponse({ status: 200, description: 'Products found successfully', type: [Product] })
  @ApiResponse({ status: 400, description: 'Invalid price range' })
  searchByPriceRange(
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ): Promise<Product[]> {
    return this.productsService.findProductsByPriceRange(
      parseFloat(minPrice),
      parseFloat(maxPrice),
    );
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiQuery({ name: 'threshold', type: 'number', required: false, description: 'Stock threshold (default: 10)' })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully', type: [Product] })
  @ApiResponse({ status: 400, description: 'Invalid threshold' })
  findLowStockProducts(
    @Query('threshold') threshold?: string,
  ): Promise<Product[]> {
    const thresholdValue = threshold ? parseInt(threshold, 10) : 10;
    return this.productsService.findLowStockProducts(thresholdValue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Failed to fetch product' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Failed to update product' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Failed to delete product' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }
} 
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data?: T | undefined;

  @ApiProperty({ description: 'Pagination info', required: false })
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(success: boolean, message: string, data?: T, pagination?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }
}

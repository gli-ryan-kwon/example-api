import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'List of items', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;

  @ApiProperty({
    description: 'Total number of items matching the query',
    example: 20,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 2,
  })
  totalPages: number;

  constructor(
    data: T[],
    page: number,
    limit: number,
    totalCount: number,
    totalPages: number,
  ) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
    this.totalPages = totalPages;
  }
}

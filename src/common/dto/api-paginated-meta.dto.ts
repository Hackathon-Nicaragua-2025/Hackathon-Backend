import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({
    example: 1,
    description: 'The current page number.',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'The number of items returned per page.',
  })
  take: number;

  @ApiProperty({
    example: 100,
    description: 'The total number of items available in the dataset.',
  })
  itemCount: number;

  @ApiProperty({
    example: 10,
    description: 'The total number of pages.',
  })
  pageCount: number;

  @ApiProperty({
    example: true,
    description: 'Whether there is a previous page.',
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether there is a next page.',
  })
  hasNextPage: boolean;

  private constructor(
    page: number,
    take: number,
    itemCount: number,
    pageCount: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean,
  ) {
    this.page = page;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = pageCount;
    this.hasPreviousPage = hasPreviousPage;
    this.hasNextPage = hasNextPage;
  }
}

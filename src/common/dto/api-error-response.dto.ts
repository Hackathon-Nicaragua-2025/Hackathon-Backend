import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indicates that the operation failed.',
  })
  succeeded: boolean;

  @ApiProperty({
    example: 'Operation failed',
    description: 'A brief title or status of the failed operation.',
  })
  title: string;

  @ApiProperty({
    example: 'Detailed error message explaining the failure.',
    description: 'A detailed message explaining the result of the failed operation.',
  })
  message: string;

  constructor(message: string, title = 'Operation failed') {
    this.succeeded = false;
    this.message = message;
    this.title = title;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    required: false,
    type: Object,
    description: 'The data returned from the operation, if successful.',
  })
  data?: T;

  @ApiProperty({
    example: true,
    description: 'Indicates if the operation was successful.',
  })
  succeeded: boolean;

  @ApiProperty({
    example: 'Operation successful',
    description: 'A brief title or status of the operation.',
  })
  title: string;

  @ApiProperty({
    example: 'The operation was executed successfully.',
    description: 'A detailed message explaining the result of the operation.',
  })
  message: string;

  protected constructor(data: T | null, succeeded: boolean, message: string, title: string) {
    this.data = data ?? undefined;
    this.succeeded = succeeded;
    this.message = message;
    this.title = title;
  }

  // Method for success case
  static Success<T>(data: T, title = '', message = ''): ApiResponseDto<T> {
    return new ApiResponseDto<T>(data, true, message, title);
  }

  // Method for failure case
  static Failure<T>(message: string, title = ''): ApiResponseDto<T> {
    return new ApiResponseDto<T>(null, false, message, title);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: 25 })
  @Expose()
  age!: number;
}

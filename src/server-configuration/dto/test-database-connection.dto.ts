import { IsInt } from 'class-validator';

export class TestDatabaseConnectionDto {
  @IsInt()
  serverId!: number;
}

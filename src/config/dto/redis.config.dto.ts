import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RedisConfigDto {
  @IsString()
  host: string;

  @IsNumber()
  @Type(() => Number)
  database: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsNumber()
  @Type(() => Number)
  port: number;
}

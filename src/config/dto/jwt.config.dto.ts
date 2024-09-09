import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class JwtConfigDto {
  @IsNumber()
  @Type(() => Number)
  salt: number;

  @IsString()
  accessSecret: string;

  @IsString()
  refreshSecret: string;
}

import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum Environment {
  prod = 'prod',
  dev = 'dev',
}

export class ConfigDto {
  @IsEnum(Environment)
  ENV: Environment;

  @IsNumber()
  @Type(() => Number)
  PORT: number;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  TELEGRAM_TOKEN: string;

  @IsNumber()
  @Type(() => Number)
  TELEGRAM_CHAT_ID: number;

  @IsString()
  POSTGRESQL_HOST: string;

  @IsString()
  POSTGRESQL_DATABASE: string;

  @IsString()
  POSTGRESQL_USERNAME: string;

  @IsString()
  POSTGRESQL_PASSWORD: string;

  @IsNumber()
  @Type(() => Number)
  POSTGRESQL_PORT: number;
}

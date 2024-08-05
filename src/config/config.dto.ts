import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @Type(() => Number)
  SALT: number;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  ADMIN_NICK: string;

  @IsString()
  ADMIN_PASSWORD: string;

  @IsString()
  ADMIN_EMAIL: string;

  @IsString()
  TELEGRAM_TOKEN: string;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;

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

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @Type(() => Number)
  REDIS_DATABASE: number;

  @IsString()
  REDIS_USERNAME: string;

  @IsString()
  REDIS_PASSWORD: string;

  @IsNumber()
  @Type(() => Number)
  REDIS_PORT: number;
}

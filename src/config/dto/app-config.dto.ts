import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { AdminConfigDto, JwtConfigDto, PostgresConfigDto, SmtpConfigDto } from './index';

export enum Environment {
  prod = 'prod',
  dev = 'dev',
}

export class AppConfigDto {
  @IsEnum(Environment)
  env: Environment;

  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  rabbitUrl: string;

  @IsString()
  redisUrl: string;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(JwtConfigDto, value))
  jwt: JwtConfigDto;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(AdminConfigDto, value))
  admin: AdminConfigDto;

  @IsString()
  telegramToken: string;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(SmtpConfigDto, value))
  smtp: SmtpConfigDto;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(PostgresConfigDto, value))
  postgres: PostgresConfigDto;
}

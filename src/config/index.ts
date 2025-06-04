import { config as readEnv } from 'dotenv';
import { validate } from '../validation/validate';
import { AppConfigDto } from './app-config.dto';

readEnv();

type EnvStructure<T = any> = {
  [key in keyof T]: T[key] extends object ? EnvStructure<T[key]> : string | undefined;
};

const rawConfig: EnvStructure<AppConfigDto> = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  rabbitUri: process.env.RABBIT_URI,
  telegramToken: process.env.TELEGRAM_TOKEN,
  admin: {
    nick: process.env.ADMIN_NICK,
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL,
  },
  smtp: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  postgres: {
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    database: process.env.REDIS_DATABASE,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
};

export const appConfig = validate(AppConfigDto, rawConfig);

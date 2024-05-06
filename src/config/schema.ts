import Joi from 'joi';

export type ConfigDto = {
  PORT: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: number;
  POSTGRESQL_HOST: string;
  POSTGRESQL_DATABASE: string;
  POSTGRESQL_USERNAME: string;
  POSTGRESQL_PASSWORD: string;
  POSTGRESQL_PORT: number;
};

export const ConfigSchema = Joi.object<ConfigDto>().keys({
  PORT: Joi.number().port().required(),
  JWT_ACCESS_SECRET: Joi.string().min(4).required(),
  JWT_REFRESH_SECRET: Joi.string().min(4).required(),
  TELEGRAM_TOKEN: Joi.string().required(),
  TELEGRAM_CHAT_ID: Joi.number().required(),
  POSTGRESQL_HOST: Joi.string().required(),
  POSTGRESQL_DATABASE: Joi.string().required(),
  POSTGRESQL_USERNAME: Joi.string().required(),
  POSTGRESQL_PASSWORD: Joi.string().required(),
  POSTGRESQL_PORT: Joi.number().port().required(),
});

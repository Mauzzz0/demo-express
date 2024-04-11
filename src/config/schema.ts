import Joi from 'joi';

export type ConfigDto = {
  PORT: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
};

export const ConfigSchema = Joi.object<ConfigDto>().keys({
  PORT: Joi.number().port(),
  JWT_ACCESS_SECRET: Joi.string().min(4),
  JWT_REFRESH_SECRET: Joi.string().min(4),
});

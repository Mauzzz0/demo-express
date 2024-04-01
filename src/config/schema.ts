import Joi from 'joi';

export type ConfigDto = {
  PORT: number;
};

export const ConfigSchema = Joi.object<ConfigDto>().keys({
  PORT: Joi.number().port(),
});

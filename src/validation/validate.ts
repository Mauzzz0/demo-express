import { BadRequestException } from '../errors';
import Joi from 'joi';

export const validate = <T = any>(object: any, schema: Joi.AnySchema<T>): T => {
  const validationResult = schema.validate(object);

  if (validationResult.error) {
    throw new BadRequestException(validationResult.error.message);
  }

  return validationResult.value;
};

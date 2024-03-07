import Joi from 'joi';

export const validate = (object: any, schema: Joi.ObjectSchema) => {
  const validationResult = schema.validate(object);

  if (validationResult.error) {
    throw Error(validationResult.error.message);
  }

  return validationResult.value;
};

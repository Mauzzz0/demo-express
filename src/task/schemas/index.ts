import Joi from 'joi';

export const TaskSchema = Joi.object().keys({
  title: Joi.string().min(1).required(),
  description: Joi.string().optional(),
});

export const PaginationSchema = Joi.object().keys({
  limit: Joi.number().integer().min(1).max(50).optional().default(10),
  offset: Joi.number().integer().min(0).optional().default(0),
});

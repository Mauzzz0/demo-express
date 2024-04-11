import Joi from 'joi';
import { LoginDto, TokenDto } from '../user.types';

export const LoginSchema = Joi.object<LoginDto>().keys({
  nick: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const TokenSchema = Joi.object<TokenDto>().keys({
  token: Joi.string().required(),
});

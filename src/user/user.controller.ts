import { validate } from '../validation/validate';
import { LoginSchema, TokenSchema } from './schemas';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { TokenModel } from '../database/models/token.model';

const profile = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const result = await UserService.profile(userId);

  res.json(result);
};

const login = async (req: Request, res: Response) => {
  const body = validate(req.body, LoginSchema);

  const tokens = await UserService.login(body);

  res.json(tokens);
};

const logout = async (req: Request, res: Response) => {
  const { body } = req;
  const { token } = validate(body, TokenSchema);
  await TokenModel.destroy({ where: { token } });

  res.json({ result: true });
};

const refresh = async (req: Request, res: Response) => {
  const { body } = req;
  const { token } = validate(body, TokenSchema);
  const tokens = await UserService.refresh(token);

  res.json(tokens);
};

const signup = async (req: Request, res: Response) => {
  const body = validate(req.body, LoginSchema);

  await UserService.signup(body);

  res.json({ success: true });
};

export const UserController = { profile, login, logout, refresh, signup };

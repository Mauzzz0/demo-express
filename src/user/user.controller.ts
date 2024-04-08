import { UnauthorizedException } from '../errors/UnauthorizedException';
import { validate } from '../validation/validate';
import { LoginSchema } from './schemas';
import { UserService } from './user.service';
import { Request, Response } from 'express';

const profile = (req: Request, res: Response) => {
  const { userId } = req.session;
  if (!userId) {
    throw new UnauthorizedException();
  }

  const result = UserService.profile(userId);

  res.json(result);
};

const login = (req: Request, res: Response) => {
  const body = validate(req.body, LoginSchema);

  const user = UserService.login(body);

  req.session.userId = user.id;

  res.json(user);
};

const logout = (req: Request, res: Response) => {
  const { userId } = req.session;
  if (!userId) {
    throw new UnauthorizedException();
  }

  delete req.session.userId;

  res.json({ result: true });
};

export const UserController = { profile, login, logout };

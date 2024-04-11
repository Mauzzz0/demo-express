import { validate } from '../validation/validate';
import { LoginSchema, TokenSchema } from './schemas';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { tokenRepository } from '../jwt/tokens.repository';

const profile = (req: Request, res: Response) => {
  // const { userId } = req.session;
  // if (!userId) {
  //   throw new UnauthorizedException();
  // }

  const { userId } = res.locals;
  const result = UserService.profile(userId);

  res.json(result);
};

const login = (req: Request, res: Response) => {
  const body = validate(req.body, LoginSchema);

  const tokens = UserService.login(body);

  // req.session.userId = user.id;

  res.json(tokens);
};

const logout = (req: Request, res: Response) => {
  // const { userId } = req.session;
  // if (!userId) {
  //   throw new UnauthorizedException();
  // }
  // delete req.session.userId;

  const { body } = req;
  const { token } = validate(body, TokenSchema);
  tokenRepository.remove(token); // Warn: Аксес токен будет ещё жить, клиент сам его должен удалить

  res.json({ result: true });
};

const refresh = (req: Request, res: Response) => {
  // const { userId } = req.session;
  // if (!userId) {
  //   throw new UnauthorizedException();
  // }
  // delete req.session.userId;

  const { body } = req;
  const { token } = validate(body, TokenSchema);
  const tokens = UserService.refresh(token);

  res.json(tokens);
};

export const UserController = { profile, login, logout, refresh };

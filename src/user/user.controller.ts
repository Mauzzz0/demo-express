import { Request, Response } from 'express';

import { TokenModel } from '../database/models';
import JwtGuard from '../guards/jwt.guard';
import { BaseController } from '../shared/base.controller';
import { Route } from '../shared/types';
import { validate } from '../validation/validate';
import { LoginDto, TokenDto } from './user.dto';
import { UserService } from './user.service';

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard];

    const routes: Route[] = [
      { path: '/login', method: 'post', handler: this.login },
      { path: '/signup', method: 'post', handler: this.signup },
      { path: '/profile', handler: this.profile, middlewares },
      { path: '/logout', method: 'post', handler: this.logout, middlewares },
      { path: '/refresh', method: 'post', handler: this.refresh, middlewares },
    ];

    this.addRoute(routes);
  }

  async profile(req: Request, res: Response) {
    const { userId } = res.locals;
    const result = await this.service.profile(userId);

    res.json(result);
  }

  async login(req: Request, res: Response) {
    const body = validate(LoginDto, req.body);

    const tokens = await this.service.login(body);

    res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { token } = validate(TokenDto, req.body);
    await TokenModel.destroy({ where: { token } });

    res.json({ result: true });
  }

  async refresh(req: Request, res: Response) {
    const { token } = validate(TokenDto, req.body);
    const tokens = await this.service.refresh(token);

    res.json(tokens);
  }

  async signup(req: Request, res: Response) {
    const body = validate(LoginDto, req.body);

    await this.service.signup(body);

    res.json({ success: true });
  }
}

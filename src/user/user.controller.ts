import { Request, Response } from 'express';

import { TokenModel, UserRole } from '../database/models';
import { JwtGuard, RoleGuard } from '../guards';
import { BaseController } from '../shared/base.controller';
import { IdNumberDto } from '../shared/id.number.dto';
import { PaginationDto } from '../shared/pagination.dto';
import { Route } from '../shared/types';
import { validate } from '../validation/validate';
import { LoginDto, RegisterDto, TokenDto } from './user.dto';
import { UserService } from './user.service';

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard];
    const adminOnly = [...middlewares, RoleGuard(UserRole.admin)];

    const routes: Route[] = [
      { path: '', handler: this.list, middlewares: adminOnly },
      { path: '/login', method: 'post', handler: this.login },
      { path: '/register', method: 'post', handler: this.register, middlewares: adminOnly },
      { path: '/profile', handler: this.profile, middlewares },
      { path: '/logout', method: 'post', handler: this.logout, middlewares },
      { path: '/refresh', method: 'post', handler: this.refresh, middlewares },
      { path: '/:id/block', method: 'post', handler: this.blockUser, middlewares: adminOnly },
      { path: '/:id/unblock', method: 'post', handler: this.unblockUser, middlewares: adminOnly },
    ];

    this.addRoute(routes);
  }

  async blockUser(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.blockOrUnblockUser(id, false);

    res.json(result);
  }

  async unblockUser(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.blockOrUnblockUser(id, true);

    res.json(result);
  }

  async list(req: Request, res: Response) {
    const payload = validate(PaginationDto, req.query);

    const result = await this.service.getAll(payload);

    res.json(result);
  }

  async profile(req: Request, res: Response) {
    const {
      user: { id },
    } = res.locals;
    const result = await this.service.profile(id);

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

  async register(req: Request, res: Response) {
    const body = validate(RegisterDto, req.body);

    await this.service.register(body);

    res.json({ success: true });
  }
}

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard, RoleGuard } from '../../guards';
import { IdNumberDto, PaginationDto } from '../../shared';
import { BaseController } from '../../shared/base.controller';
import { Route } from '../../shared/types';
import { validate } from '../../validation/validate';
import { JwtService } from './jwt.service';
import { ChangePasswordDto, LoginDto, RegisterDto, RestorePasswordDto, TokenDto } from './user.dto';
import { UserService } from './user.service';
import { UserRole } from './user.types';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(UserService)
    private readonly service: UserService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard(this.jwtService)];
    const adminOnly = [...middlewares, RoleGuard(UserRole.admin)];

    const routes: Route[] = [
      { path: '', handler: this.list, middlewares: adminOnly },
      { path: '/login', method: 'post', handler: this.login },
      { path: '/register', method: 'post', handler: this.register },
      { path: '/password/restore', method: 'post', handler: this.passwordRestore },
      { path: '/password/change', method: 'put', handler: this.passwordChange },
      { path: '/profile', handler: this.profile, middlewares },
      { path: '/profile/telegram-link', handler: this.telegramLink, middlewares },
      { path: '/profile/:id', handler: this.profileAdmin, middlewares: adminOnly },
      { path: '/logout', method: 'post', handler: this.logout, middlewares },
      { path: '/refresh', method: 'post', handler: this.refresh },
      { path: '/:id/block', method: 'post', handler: this.blockUser, middlewares: adminOnly },
      { path: '/:id/unblock', method: 'post', handler: this.unblockUser, middlewares: adminOnly },
    ];

    this.addRoute(routes);
  }

  async passwordRestore(req: Request, res: Response) {
    const { email } = validate(RestorePasswordDto, req.body);

    const result = await this.service.passwordRestore(email);

    res.json(result);
  }

  async passwordChange(req: Request, res: Response) {
    const dto = validate(ChangePasswordDto, req.body);

    const result = await this.service.passwordChange(dto);

    res.json(result);
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

  async profileAdmin(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);
    const result = await this.service.profile(id);

    res.json(result);
  }

  async profile(req: Request, res: Response) {
    const {
      user: { id },
    } = res.locals;
    const result = await this.service.profile(id);

    res.json(result);
  }

  async telegramLink(req: Request, res: Response) {
    const result = await this.service.getTelegramLink(res.locals.user.id);

    res.json(result);
  }

  async login(req: Request, res: Response) {
    const body = validate(LoginDto, req.body);

    const tokens = await this.service.login(body);

    res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { token } = validate(TokenDto, req.body);
    await this.service.logout(token);

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

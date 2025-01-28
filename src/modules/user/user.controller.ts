import axios from 'axios';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { UserRole } from '../../database/models';
import { redisTempMailKey } from '../../database/redis/redis.keys';
import { RedisService } from '../../database/redis/redis.service';
import { BadRequestException } from '../../errors';
import { JwtGuard, RoleGuard } from '../../guards';
import { BaseController } from '../../shared/base.controller';
import { IdNumberDto } from '../../shared/id-number.dto';
import { PaginationDto } from '../../shared/pagination.dto';
import { Route } from '../../shared/types';
import { validate } from '../../validation/validate';
import { JwtService } from './jwt.service';
import { ChangePasswordDto, LoginDto, RegisterDto, RestorePasswordDto, TokenDto } from './user.dto';
import { UserService } from './user.service';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(UserService)
    private readonly service: UserService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
    @inject(RedisService)
    private readonly redisService: RedisService,
  ) {
    super();
    this.initRoutes();
    this.loadTempMails();
  }

  initRoutes() {
    const middlewares = [JwtGuard(this.jwtService)];
    const adminOnly = [...middlewares, RoleGuard(UserRole.admin)];

    const routes: Route[] = [
      { path: '', handler: this.list, middlewares: adminOnly },
      { path: '/login', method: 'post', handler: this.login },
      { path: '/register', method: 'post', handler: this.register, middlewares: adminOnly },
      { path: '/password/restore', method: 'post', handler: this.passwordRestore },
      { path: '/password/change', method: 'put', handler: this.passwordChange },
      { path: '/profile', handler: this.profile, middlewares },
      { path: '/profile/telegram-link', handler: this.telegramLink, middlewares },
      { path: '/profile/:id', handler: this.profileAdmin, middlewares: adminOnly },
      { path: '/logout', method: 'post', handler: this.logout, middlewares },
      { path: '/refresh', method: 'post', handler: this.refresh, middlewares },
      { path: '/:id/block', method: 'post', handler: this.blockUser, middlewares: adminOnly },
      { path: '/:id/unblock', method: 'post', handler: this.unblockUser, middlewares: adminOnly },
    ];

    this.addRoute(routes);
  }

  async loadTempMails() {
    try {
      const url = 'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt';

      const { data } = await axios.get<string>(url);
      const emails = data.split('\n');

      const day = 86400;

      await Promise.all(emails.map((email) => this.redisService.set(redisTempMailKey(email), { email }, { EX: day })));

      return true;
    } catch (error) {
      return error;
    }
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
    const { id } = res.locals.user;
    await this.service.logout(id);

    res.json({ result: true });
  }

  async refresh(req: Request, res: Response) {
    const { token } = validate(TokenDto, req.body);
    const { id } = res.locals.user;

    const tokens = await this.service.refresh(id, token);

    res.json(tokens);
  }

  async register(req: Request, res: Response) {
    const body = validate(RegisterDto, req.body);
    const tempMail = await this.redisService.get(redisTempMailKey(body.email.split('@')[1] ?? ''));
    if (tempMail) {
      throw new BadRequestException('Bad email');
    }

    await this.service.register(body);

    res.json({ success: true });
  }
}

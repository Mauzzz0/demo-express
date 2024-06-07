import { validate } from '../validation/validate';
import { LoginSchema, TokenSchema } from './schemas';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { TokenModel } from '../database/models/token.model';
import JwtGuard from '../jwt/jwt.guard';
import { BaseController } from '../shared/base.controller';

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard];

    this.addRoute({ path: '/login', method: 'post', handler: this.login });
    this.addRoute({ path: '/signup', method: 'post', handler: this.signup });
    this.addRoute({ path: '/profile', handler: this.profile, middlewares: [JwtGuard] });
    this.addRoute({ path: '/logout', method: 'post', handler: this.logout, middlewares });
    this.addRoute({ path: '/refresh', method: 'post', handler: this.refresh, middlewares });
  }

  async profile(req: Request, res: Response) {
    const { userId } = res.locals;
    const result = await this.service.profile(userId);

    res.json(result);
  }

  async login(req: Request, res: Response) {
    const body = validate(req.body, LoginSchema);

    const tokens = await this.service.login(body);

    res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { body } = req;
    const { token } = validate(body, TokenSchema);
    await TokenModel.destroy({ where: { token } });

    res.json({ result: true });
  }

  async refresh(req: Request, res: Response) {
    const { body } = req;
    const { token } = validate(body, TokenSchema);
    const tokens = await this.service.refresh(token);

    res.json(tokens);
  }

  async signup(req: Request, res: Response) {
    const body = validate(req.body, LoginSchema);

    await this.service.signup(body);

    res.json({ success: true });
  }
}

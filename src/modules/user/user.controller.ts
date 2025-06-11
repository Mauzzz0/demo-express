import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard, RoleGuard } from '../../guards';
import { IdNumberDto, PaginationDto } from '../../shared';
import { validate } from '../../validation';
import { JwtService } from '../jwt/jwt.service';
import { ChangePasswordDto, LoginDto, RegisterDto, RestorePasswordDto, TokenDto } from './dto';
import { UserService } from './user.service';
import { UserRole } from './user.types';

@injectable()
export class UserController {
  public readonly router = Router();

  constructor(
    @inject(UserService)
    private readonly service: UserService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    const authentication = JwtGuard(this.jwtService);
    const authorization = [authentication, RoleGuard(UserRole.admin)];

    // Authentication
    this.router.post('/login', (req: Request, res: Response) => this.login(req, res));
    this.router.post('/logout', authentication, (req: Request, res: Response) => this.logout(req, res));
    this.router.post('/refresh', (req: Request, res: Response) => this.refresh(req, res));
    this.router.post('/register', (req: Request, res: Response) => this.register(req, res));
    this.router.post('/password/restore', (req: Request, res: Response) => this.passwordRestore(req, res));
    this.router.put('/password/change', (req: Request, res: Response) => this.passwordChange(req, res));

    // Profile
    this.router.get('/profile', authentication, (req: Request, res: Response) => this.profile(req, res));
    this.router.get('/profile/telegram-link', authentication, (req: Request, res: Response) =>
      this.telegramLink(req, res),
    );

    // Admin methods. Other profiles or blocking
    this.router.get('/', ...authorization, (req: Request, res: Response) => this.list(req, res));
    this.router.get('/:id', ...authorization, (req: Request, res: Response) => this.profileAdmin(req, res));
    this.router.post('/:id/block', ...authorization, (req: Request, res: Response) => this.blockUser(req, res));
    this.router.post('/:id/unblock', ...authorization, (req: Request, res: Response) => this.unblockUser(req, res));
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

    const tokens = await this.service.login(body, req.ip);

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

    const profile = await this.service.register(body);

    res.json(profile);
  }
}

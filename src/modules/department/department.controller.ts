import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard, RoleGuard } from '../../guards';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validation';
import { JwtService } from '../jwt/jwt.service';
import { UserRole } from '../user/user.types';
import { DepartmentService } from './department.service';
import { CreateDepartmentBodyDto } from './dto';

@injectable()
export class DepartmentController {
  public readonly router = Router();

  constructor(
    @inject(DepartmentService)
    private readonly service: DepartmentService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    const authentication = JwtGuard(this.jwtService);
    const authorization = [authentication, RoleGuard(UserRole.admin)];

    // Create
    this.router.post('/', authentication, (req: Request, res: Response) => this.create(req, res));

    // Read
    this.router.get('/', authentication, (req: Request, res: Response) => this.getAll(req, res));

    // Delete
    this.router.delete('/:id', authorization, (req: Request, res: Response) => this.deleteOne(req, res));
  }

  async create(req: Request, res: Response) {
    const body = validate(CreateDepartmentBodyDto, req.body);

    const result = await this.service.create(body);

    res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await this.service.getAll();

    res.json(result);
  }

  async deleteOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.deleteOne(id);

    res.json(result);
  }
}

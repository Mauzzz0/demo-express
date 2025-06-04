import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard, RoleGuard } from '../../guards';
import { IdNumberDto, PaginationDto } from '../../shared';
import { validate } from '../../validation';
import { JwtService } from '../jwt/jwt.service';
import { UserRole } from '../user/user.types';
import { CreateTaskDto, GetTaskListDto } from './dto';
import { TaskService } from './task.service';

@injectable()
export class TaskController {
  public readonly router = Router();

  constructor(
    @inject(TaskService)
    private readonly service: TaskService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    const authentication = JwtGuard(this.jwtService);
    const authorization = [authentication, RoleGuard(UserRole.admin)];

    // Create
    this.router.post('/', authentication, (req: Request, res: Response) => this.create(req, res));

    // Read
    this.router.get('/authored', authentication, (req: Request, res: Response) => this.getAuthored(req, res));
    this.router.get('/assigned', authentication, (req: Request, res: Response) => this.getAssigned(req, res));
    this.router.get('/', authentication, (req: Request, res: Response) => this.getAll(req, res));
    this.router.get('/:id', authentication, (req: Request, res: Response) => this.getOne(req, res));

    // Update
    this.router.put('/:id', authentication, (req: Request, res: Response) => this.update(req, res));

    // Delete
    this.router.delete('/:id', authorization, (req: Request, res: Response) => this.deleteOne(req, res));
  }

  async create(req: Request, res: Response) {
    const body = validate(CreateTaskDto, req.body);

    const result = await this.service.create(res.locals.user.id, body);

    res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const query = validate(GetTaskListDto, req.query);

    const result = await this.service.getAll(query);

    res.json(result);
  }

  async getAuthored(req: Request, res: Response) {
    const query = validate(PaginationDto, req.query);

    const result = await this.service.getAuthored(query, res.locals.user.id);

    res.json(result);
  }

  async getAssigned(req: Request, res: Response) {
    const query = validate(PaginationDto, req.query);

    const result = await this.service.getAssigned(query, res.locals.user.id);

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.getOne(id);

    res.json(result);
  }

  async deleteOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.deleteOne(id);

    res.json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);
    const payload = validate(CreateTaskDto, req.body);

    const [_, [result]] = await this.service.update(id, payload);

    res.json(result);
  }
}

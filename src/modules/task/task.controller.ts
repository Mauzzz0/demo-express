import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard, RoleGuard } from '../../guards';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validation/validate';
import { JwtService } from '../user/jwt.service';
import { UserRole } from '../user/user.types';
import { CreateTaskDto, GetTaskListDto } from './task.dto';
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
    this.router.get('/', authentication, (req: Request, res: Response) => this.getAll(req, res));
    this.router.get('/:id', authentication, (req: Request, res: Response) => this.getOne(req, res));

    // Update
    this.router.put('/:id', authentication, (req: Request, res: Response) => this.update(req, res));

    // Delete
    this.router.delete('/:id', authorization, (req: Request, res: Response) => this.deleteOne(req, res));
  }

  async create(req: Request, res: Response) {
    const payload = validate(CreateTaskDto, req.body);

    const result = await this.service.create(res.locals.user.id, payload);

    res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const payload = validate(GetTaskListDto, req.query);

    const result = await this.service.getAll(payload);

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

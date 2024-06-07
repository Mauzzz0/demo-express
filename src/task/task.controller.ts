import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import { PaginationAndSortingSchema, PositiveNumberSchema, TaskSchema } from './schemas';
import { TaskService } from './task.service';
import { BaseController } from '../shared/base.controller';
import JwtGuard from '../jwt/jwt.guard';

export class TaskController extends BaseController {
  constructor(private readonly service: TaskService) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard];

    this.addRoute({ path: '/', method: 'post', handler: this.create, middlewares });
    this.addRoute({ path: '/', method: 'get', handler: this.getAll, middlewares });
    this.addRoute({ path: '/:id', method: 'get', handler: this.getOne, middlewares });
    this.addRoute({ path: '/:id', method: 'put', handler: this.update, middlewares });
    this.addRoute({ path: '/:id', method: 'delete', handler: this.deleteOne, middlewares });
  }

  async create(req: Request, res: Response) {
    const payload = validate(req.body, TaskSchema);

    const result = await this.service.create(res.locals.userId, payload);

    res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const payload = validate(req.query, PaginationAndSortingSchema);

    const result = await this.service.getAll(res.locals.userId, payload);

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const id = validate(req.params.id, PositiveNumberSchema);

    const result = await this.service.getOne(res.locals.userId, id);

    res.json(result);
  }

  async deleteOne(req: Request, res: Response) {
    const id = validate(req.params.id, PositiveNumberSchema);

    const result = await this.service.deleteOne(res.locals.userId, id);

    res.json(result);
  }

  async update(req: Request, res: Response) {
    const id = validate(req.params.id, PositiveNumberSchema);
    const payload = validate(req.body, TaskSchema);

    const result = await this.service.update(res.locals.userId, id, payload);

    res.json(result);
  }
}

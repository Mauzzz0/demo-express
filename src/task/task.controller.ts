import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import { TaskService } from './task.service';
import { BaseController } from '../shared/base.controller';
import JwtGuard from '../jwt/jwt.guard';
import { Route } from '../shared/types';
import { CreateTask, PaginationAndSortingDto } from './task.dto';
import { IdNumberDto } from '../validation/dto';

export class TaskController extends BaseController {
  constructor(private readonly service: TaskService) {
    super();
    this.initRoutes();
  }

  initRoutes() {
    const middlewares = [JwtGuard];

    const routes: Route[] = [
      { path: '/', method: 'post', handler: this.create, middlewares },
      { path: '/', method: 'get', handler: this.getAll, middlewares },
      { path: '/:id', method: 'get', handler: this.getOne, middlewares },
      { path: '/:id', method: 'put', handler: this.update, middlewares },
      { path: '/:id', method: 'delete', handler: this.deleteOne, middlewares },
    ];

    this.addRoute(routes);
  }

  async create(req: Request, res: Response) {
    const payload = validate(CreateTask, req.body);

    const result = await this.service.create(res.locals.userId, payload);

    res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const payload = validate(PaginationAndSortingDto, req.query);

    const result = await this.service.getAll(res.locals.userId, payload);

    res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.getOne(res.locals.userId, id);

    res.json(result);
  }

  async deleteOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.service.deleteOne(res.locals.userId, id);

    res.json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);
    const payload = validate(CreateTask, req.body);

    const result = await this.service.update(res.locals.userId, id, payload);

    res.json(result);
  }
}

import { Request, Response } from 'express';

import { UserRole } from '../database/models';
import { JwtGuard, RoleGuard } from '../guards';
import { BaseController } from '../shared/base.controller';
import { Route } from '../shared/types';
import { IdNumberDto } from '../validation/dto';
import { validate } from '../validation/validate';
import { CreateTaskDto, GetTaskListDto } from './task.dto';
import { TaskService } from './task.service';

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
      {
        path: '/:id',
        method: 'delete',
        handler: this.deleteOne,
        middlewares: [...middlewares, RoleGuard(UserRole.admin)],
      },
    ];

    this.addRoute(routes);
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

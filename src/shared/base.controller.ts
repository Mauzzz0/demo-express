import { Router } from 'express';
import { injectable } from 'inversify';
import logger from '../logger/pino.logger';
import { Route } from './types';

@injectable()
export abstract class BaseController {
  public readonly router: Router = Router();

  public addRoute(routes: Route | Route[]) {
    for (const route of [routes].flat(2)) {
      const handler = route.handler.bind(this);
      const method = route.method ?? 'get';
      const handlers = [...(route.middlewares ? route.middlewares : []), handler];

      this.router[method](route.path, handlers);
      logger.info(`Route registered: ${method.toUpperCase()} ${route.path}`);
    }
  }

  public abstract initRoutes(): void;
}

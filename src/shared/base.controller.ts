import { Router } from 'express';
import { injectable } from 'inversify';

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
      console.info(`Route registered: ${method.toUpperCase()} ${route.path}`);
    }
  }

  public abstract initRoutes(): void;
}

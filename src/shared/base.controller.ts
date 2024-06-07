import { Router } from 'express';
import { Route } from './types';

export abstract class BaseController {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }

  public addRoute(route: Route) {
    const handler = route.handler.bind(this);
    const method = route.method ?? 'get';
    const handlers = [...(route.middlewares ? route.middlewares : []), handler];

    this.router[method](route.path, handlers);
    console.info(`Route registered: ${method.toUpperCase()} ${route.path}`);
  }

  public abstract initRoutes(): void;
}

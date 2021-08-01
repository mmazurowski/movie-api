import 'reflect-metadata';
import { Router } from 'express';
import { getRouterWithRegisteredRoutes } from '@application/server/rest/decorators/register-by-controller';

export abstract class ExpressController {
  protected readonly router: Router;

  protected readonly route: string;

  constructor(route?: string) {
    this.route = route ?? '';
  }

  public getRouter(): Router {
    return getRouterWithRegisteredRoutes(this, Router());
  }

  public getRoute() {
    return this.route;
  }
}

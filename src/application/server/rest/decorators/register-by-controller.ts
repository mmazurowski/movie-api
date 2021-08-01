import { Router } from 'express';
import { extractMetaData } from './extract';

/**
 *
 * @param instance
 * @param router
 */
export const getRouterWithRegisteredRoutes = (instance, router: Router): Router => {
  const methodsBoundedByDecorator = extractMetaData(instance);

  methodsBoundedByDecorator.forEach((httpMethod) => {
    // Convert meta keys to http methods from express
    const expressHttpMethod = httpMethod[0].toLowerCase();

    // Handlers array
    const allHandlersForCurrentHttpMethod = httpMethod[1] ?? [];

    // Connect methods to router
    allHandlersForCurrentHttpMethod.forEach((element) => {
      const currentRoute = `${instance.route + element[0]}`;

      // Controller method reference
      const handler = instance[element[1]];

      router[expressHttpMethod](currentRoute, handler.bind(instance)());
    });
  });
  return router;
};

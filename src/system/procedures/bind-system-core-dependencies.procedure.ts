import * as Awilix from 'awilix';
import { AwilixContainer } from 'awilix';
import { Procedure } from '@lunar-flight-v/system';
import { CQRSBus } from '@lunar-flight-v/command-module';
import { logger } from '@root/application/logger/logger';
import express from 'express';
import { join } from 'path';
import { errorMiddleware } from '@application/server/rest/middlewares/error.middleware';
import {
  asyncLocalStorage,
  requestIdMiddleware,
} from '@application/server/rest/middlewares/request-id.middleware';
import { FileSystemDatabaseImpl } from '@application/filesystem-database/filesystem-database';

export class BindSystemCoreDependenciesProcedure extends Procedure<
  AwilixContainer,
  AwilixContainer
> {
  async run(container: AwilixContainer): Promise<AwilixContainer> {
    container.register({
      server: Awilix.asValue(express()),
      cqrsBus: Awilix.asValue(new CQRSBus()),
      logger: Awilix.asValue(logger),
      errorMiddleware: Awilix.asFunction(errorMiddleware),
      requestIdMiddleware: Awilix.asFunction(requestIdMiddleware),
      asyncLocalStorage: Awilix.asValue(asyncLocalStorage),
      fileSystemDatabase: Awilix.asClass(FileSystemDatabaseImpl).singleton(),
      fileSystemMoviesPath: Awilix.asValue(
        join(__dirname, '..', '..', '..', 'database', 'db.json'),
      ),
    });

    const awilixPatterns = [
      process.env.NODE_ENV !== 'production'
        ? 'src/**/**/**/**/**/*.action.ts'
        : 'dist/**/**/**/**/**/*.action.js',
    ];

    container.loadModules(awilixPatterns, {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Awilix.Lifetime.SCOPED,
        register: Awilix.asFunction,
      },
    });

    return container;
  }
}

import * as Awilix from 'awilix';
import { Constructor } from '@tools/constructor.type';
import { CommandHandler, QueryHandler } from '@lunar-flight-v/command-module';

export interface ApplicationModule {
    controllers: Constructor<unknown>[],
    commandHandlers: Constructor<CommandHandler<any>>[],
    queryHandlers: Constructor<QueryHandler<any>>[],
    repositories: { [key in string]: Awilix.Resolver<any> },
    readModels: { [key in string]: Awilix.Resolver<any> },
    servicesImplementations: { [key in string]: Awilix.Resolver<any> },
}

import { SUPPORTED_HTTP_METHODS } from '@application/server/rest/decorators/http';

/**
 * Extracts class methods assigned to HTTP methods in Reflect API
 * @param instance {object}
 */

export const extractMetaData = (instance: object) => {
    const methodsBoundedByDecorator: Array<[string, []]> = [];

    SUPPORTED_HTTP_METHODS.forEach((meta) =>
        methodsBoundedByDecorator.push([meta, Reflect.getMetadata(`__${meta}`, instance)]),
    );

    return methodsBoundedByDecorator;
};

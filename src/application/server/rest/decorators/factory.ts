/**
 * Factory creates function for decorator declaration.
 * @param method {string}
 * @param value {string}
 */

export const httpDecoratorFactory = (method: string, value: string) =>
    // eslint-disable-next-line func-names
    function (target: any, propertyKey: string) {
        const metaKey = `__${method}`;

        const getHandlers = Reflect.getMetadata(metaKey, target) ?? [];

        getHandlers.push([value || '', propertyKey]);

        Reflect.defineMetadata(metaKey, getHandlers, target);
    };

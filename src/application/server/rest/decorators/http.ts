import { httpDecoratorFactory } from './factory';

export const SUPPORTED_HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function GET(value?: string) {
    return httpDecoratorFactory('GET', value);
}

export function POST(value?: string) {
    return httpDecoratorFactory('POST', value);
}

export function PUT(value?: string) {
    return httpDecoratorFactory('PUT', value);
}

export function PATCH(value?: string) {
    return httpDecoratorFactory('PATCH', value);
}

export function DELETE(value?: string) {
    return httpDecoratorFactory('DELETE', value);
}

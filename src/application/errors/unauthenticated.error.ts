import { AppError } from '@application/errors/app.error';

export class UnauthenticatedError extends AppError {
    name = 'UnauthenticatedError';

    code = 401;
}

import { AppError } from '@application/errors/app.error';

export class UnauthorizedError extends AppError {
  name = 'UnauthorizedError';

  code = 403;
}

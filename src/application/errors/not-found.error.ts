import { AppError } from '@application/errors/app.error';

export class NotFoundError extends AppError {
  name = 'NotFoundError';

  code = 404;
}

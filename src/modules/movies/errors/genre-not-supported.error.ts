import { AppError } from '@application/errors/app.error';

export class GenreNotSupportedError extends AppError {
  name = 'GenreNotSupportedError';
}

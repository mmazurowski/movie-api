import { AppError } from '@application/errors/app.error';

export class BusinessRuleError extends AppError {
  name = 'BusinessRuleValidationError';

  code = 400;
}

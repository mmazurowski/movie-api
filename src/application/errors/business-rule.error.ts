import { AppError } from '@application/errors/app.error';

export class BusinessRuleError extends AppError {
  name = 'BusinessRuleValidationError';

  constructor(public readonly message: string, public readonly code = 400) {
    super(message, code);
  }
}

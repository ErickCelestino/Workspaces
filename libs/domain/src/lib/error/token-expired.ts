import { UseCaseError } from '../base/use-case-error';

export class TokenExpired extends Error implements UseCaseError {
  constructor() {
    super(`Unauthorized`);
    this.name = 'Unauthorized';
  }
}

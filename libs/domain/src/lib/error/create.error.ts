import { UseCaseError } from '../base/use-case-error';

export class CreateError extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`Error creating the ${entitie}`);
    this.name = 'CreateError';
  }
}

import { UseCaseError } from '../base/use-case-error';

export class NotPermissionError extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`The user ${entitie} does not have permission on the system!`);
    this.name = 'NotPermissionError';
  }
}

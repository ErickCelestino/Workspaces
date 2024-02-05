import { UseCaseError } from '../base/use-case-error';

export class InsufficientCharacters extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`the ${entitie} must have more than three character`);
    this.name = 'InsufficientCharacters';
  }
}

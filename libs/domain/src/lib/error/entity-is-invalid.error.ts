import { UseCaseError } from '../base/use-case-error';

export class EntityIsInvalid extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`The ${entitie} invalid`);
    this.name = 'EntityIsInvalid';
  }
}

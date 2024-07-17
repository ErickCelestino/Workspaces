import { UseCaseError } from '../base/use-case-error';

export class EntityNotAssociate extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`The ${entitie} is not associated with the playlist`);
    this.name = 'EntityNotAssociate';
  }
}

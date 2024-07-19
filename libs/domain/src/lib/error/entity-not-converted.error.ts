import { UseCaseError } from '../base/use-case-error';

export class EntityNotConverted extends Error implements UseCaseError {
  constructor(entitie: string) {
    super(`The ${entitie} was not converted valid date`);
    this.name = 'EntityNotConverted';
  }
}

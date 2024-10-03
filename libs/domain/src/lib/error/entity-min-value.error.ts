import { UseCaseError } from '../base/use-case-error';

export class EntityMinValue extends Error implements UseCaseError {
  constructor(entitie: string, quantity: string, destiny: string) {
    super(
      `The ${entitie} must have at least ${quantity} associated ${destiny}`
    );
    this.name = 'EntityMinValue';
  }
}

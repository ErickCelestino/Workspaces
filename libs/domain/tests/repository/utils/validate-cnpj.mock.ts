import { ValidateCNPJRepository } from '../../../src';

export class ValidateCNPJRepositoryMock implements ValidateCNPJRepository {
  validate(_input: string): boolean {
    return true;
  }
}

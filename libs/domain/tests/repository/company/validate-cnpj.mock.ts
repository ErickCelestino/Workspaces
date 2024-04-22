import { ValidateCNPJRepository } from '../../../src';

export class ValidateCNPJRepositoryMock implements ValidateCNPJRepository {
  validate(input: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

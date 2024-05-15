import { BtrinSanitizeRepository } from '../../../src';

export class BtrinSanitizeRepositoryMock implements BtrinSanitizeRepository {
  btrin(input: string): string {
    const output = input.replace(/^\s+|\s+$/g, '');
    return output;
  }
}

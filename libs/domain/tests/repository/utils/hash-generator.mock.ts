import { HashGenerator } from '../../../src';

export class HashGeneratorMock implements HashGenerator {
  input = '';
  async hash(input: string): Promise<string> {
    this.input = input;
    return 'hash';
  }
}

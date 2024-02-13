// eslint-disable-next-line @nx/enforce-module-boundaries
import { HashGenerator } from '../../../../utils-core';

export class HashGeneratorMock implements HashGenerator {
  input = '';
  async hash(input: string): Promise<string> {
    this.input = input;
    return '';
  }
}

import { HashGenerator } from './hash-generator';
import * as bcrypt from 'bcrypt';

export class HashGeneratorImpl implements HashGenerator {
  hash(input: string): Promise<string> {
    return bcrypt.hash(input, 10);
  }
}

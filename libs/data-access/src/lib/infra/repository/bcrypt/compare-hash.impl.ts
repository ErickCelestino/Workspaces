import { CompareHashDto, CompareHashRepository } from '@workspaces/domain';
import * as bcrypt from 'bcrypt';

export class CompareHashImpl implements CompareHashRepository {
  async compare(input: CompareHashDto): Promise<boolean> {
    return bcrypt.compare(input.key, input.hash);
  }
}

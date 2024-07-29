import { BtrinSanitizeRepository } from '@workspaces/domain';

export class BtrinSanitizeRepositoryImpl implements BtrinSanitizeRepository {
  async btrin(input: string): Promise<string | undefined> {
    const output = input.replace(/^\s+|\s+$/g, '');
    return output;
  }
}

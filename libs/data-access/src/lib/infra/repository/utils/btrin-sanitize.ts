import { BtrinSanitizeRepository } from '@workspaces/domain';

export class BtrinSanitizeRepositoryImpl implements BtrinSanitizeRepository {
  btrin(input: string): string | undefined {
    const output = input.replace(/^\s+|\s+$/g, '');
    return output;
  }
}

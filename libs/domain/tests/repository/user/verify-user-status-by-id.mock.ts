import { VerifyUserStatusByIdRepository } from '../../../src';

export class VerifyUserStatusByIdRepositoryMock
  implements VerifyUserStatusByIdRepository
{
  async verify(input: string): Promise<string> {
    return 'ADM';
  }
}

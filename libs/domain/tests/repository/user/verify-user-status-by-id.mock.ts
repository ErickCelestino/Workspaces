import { VerifyUserStatusByIdRepository } from '../../../src';

export class VerifyUserStatusByIdRepositoryMock
  implements VerifyUserStatusByIdRepository
{
  inputMock = '';
  async verify(input: string): Promise<string> {
    this.inputMock = input;
    return 'ACTIVE';
  }
}

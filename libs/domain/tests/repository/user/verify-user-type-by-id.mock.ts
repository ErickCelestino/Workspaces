import { VerifyUserTypeByIdRepository } from '../../../src';

export class VerifyUserTypeByIdRepositoryMock
  implements VerifyUserTypeByIdRepository
{
  inputMock = '';
  async verify(input: string): Promise<string> {
    this.inputMock = input;
    return 'ADMIN';
  }
}

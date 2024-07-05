import { User, FilterByEmailOrNicknameRepository } from '../../../src';

export class FilterByEmailOrNicknameRepositoryMock
  implements FilterByEmailOrNicknameRepository
{
  input = '';

  async filter(input: string): Promise<User> {
    const emptyUser = {
      userId: '',
    } as User;
    this.input = input;
    return emptyUser;
  }
}

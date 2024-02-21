import { User, FilterByEmailOrNicknameRepository } from '../../../src';

export class FilterByEmailOrNicknameRepositoryMock
  implements FilterByEmailOrNicknameRepository
{
  input = '';

  async filter(input: string): Promise<User> {
    const emptyUser: User = {
      auth: [],
      birthDate: new Date(),
      name: '',
      nickname: '',
      userId: '',
    };
    this.input = input;
    return emptyUser;
  }
}

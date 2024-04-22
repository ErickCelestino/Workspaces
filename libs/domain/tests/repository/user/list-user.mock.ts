import { ListUserDto, ListUserRepository, UserList } from '../../../src';
import { listUserMock } from '../../entity';

export class ListUserRepositoryMock implements ListUserRepository {
  listUser: ListUserDto = {
    input: '',
  };

  async list(input: string): Promise<UserList[]> {
    this.listUser.input = input;
    return listUserMock;
  }
}

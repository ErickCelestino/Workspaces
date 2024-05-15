import { FindUserByIdRepository, User, UserList } from '../../../src';
import { listUserMock, userMock } from '../../entity';

export class FindUserByIdRepositoryMock implements FindUserByIdRepository {
  id = '';

  async find(id: string): Promise<UserList> {
    this.id = id;
    return listUserMock[0];
  }
}

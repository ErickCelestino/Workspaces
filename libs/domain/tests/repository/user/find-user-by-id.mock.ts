import { FindUserByIdRepository, User } from '../../../src';
import { userMock } from '../../entity';

export class FindUserByIdRepositoryMock implements FindUserByIdRepository {
  id = '';

  async find(id: string): Promise<User> {
    this.id = id;
    return userMock;
  }
}

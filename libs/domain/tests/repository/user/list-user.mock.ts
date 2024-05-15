import {
  ListUserDto,
  ListUserRepository,
  ListUserResponseDto,
} from '../../../src';
import { listUserMock } from '../../entity';

export class ListUserRepositoryMock implements ListUserRepository {
  listUser: ListUserDto = {
    input: '',
  };

  async list(input: ListUserDto): Promise<ListUserResponseDto> {
    this.listUser.input = input.input;
    return {
      total: 1,
      totalPages: 1,
      users: listUserMock,
    };
  }
}

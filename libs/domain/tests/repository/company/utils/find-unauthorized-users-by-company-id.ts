import {
  FindUnauthorizedUsersByCompanyIdDto,
  FindUnauthorizedUsersByCompanyIdRepository,
  UserList,
} from '../../../../src';
import { listUserMock } from '../../../entity';

export class FindUnauthorizedUsersByCompanyIdRepositoryMock
  implements FindUnauthorizedUsersByCompanyIdRepository
{
  inputMock = {} as FindUnauthorizedUsersByCompanyIdDto;
  async find(input: FindUnauthorizedUsersByCompanyIdDto): Promise<UserList[]> {
    this.inputMock = input;
    return listUserMock;
  }
}

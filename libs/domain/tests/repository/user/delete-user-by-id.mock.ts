import { DeleteUserByIdDto, DeleteUserByIdRepository } from '../../../src';

export class DeleteUserByIdRepositoryMock implements DeleteUserByIdRepository {
  deleteUserDto: DeleteUserByIdDto = {
    id: '',
  };
  async delete(input: DeleteUserByIdDto): Promise<void> {
    this.deleteUserDto = input;

    return undefined;
  }
}

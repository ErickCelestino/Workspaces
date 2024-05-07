import { EditUserDto, EditUserRepository } from '../../../src';

export class EditUserRepositoryMock implements EditUserRepository {
  async edit(input: EditUserDto): Promise<void> {
    return undefined;
  }
}

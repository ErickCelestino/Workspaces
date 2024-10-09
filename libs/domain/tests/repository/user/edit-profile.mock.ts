import { EditProfileDto, EditProfileRepository } from '../../../src';
import { userMock } from '../../entity';

export class EditProfileRepositoryMock implements EditProfileRepository {
  inputMock = {} as EditProfileDto;
  async edit(input: EditProfileDto): Promise<string> {
    this.inputMock = input;
    return userMock.userId;
  }
}

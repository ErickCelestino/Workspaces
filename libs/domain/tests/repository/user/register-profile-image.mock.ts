import {
  RegisterProfileImageDto,
  RegisterProfileImageRepository,
} from '../../../src';
import { userMock } from '../../entity';

export class RegisterProfileImageRepositoryMock
  implements RegisterProfileImageRepository
{
  inputMock = {} as RegisterProfileImageDto;
  async register(input: RegisterProfileImageDto): Promise<string> {
    this.inputMock = input;
    return userMock.userId;
  }
}

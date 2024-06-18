import {
  CreateContentFileRepository,
  CreateContentFileDto,
} from '../../../src';
import { ContentFileMock } from '../../entity';

export class CreateContentFileRepositoryMock
  implements CreateContentFileRepository
{
  inputMock: CreateContentFileDto = {} as CreateContentFileDto;
  async create(input: CreateContentFileDto): Promise<string[]> {
    this.inputMock = input;
    return [ContentFileMock.id];
  }
}

import {
  Directory,
  FindDirectoryByNameDto,
  FindDirectoryByNameRepository,
} from '../../../src';

export class FindDirectoryByNameRepositoryMock
  implements FindDirectoryByNameRepository
{
  inputMock = {} as FindDirectoryByNameDto;
  async find(input: FindDirectoryByNameDto): Promise<Directory | object> {
    this.inputMock = input;
    const directory = {};
    return directory;
  }
}

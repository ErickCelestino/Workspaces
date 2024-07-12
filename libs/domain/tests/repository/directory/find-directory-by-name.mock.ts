import {
  FindDirectoryByNameDto,
  FindDirectoryByNameRepository,
} from '../../../src';

export class FindDirectoryByNameRepositoryMock
  implements FindDirectoryByNameRepository
{
  inputMock = {} as FindDirectoryByNameDto;
  async find(input: FindDirectoryByNameDto): Promise<string> {
    this.inputMock = input;
    return '';
  }
}

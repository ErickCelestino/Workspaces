import { ConvertStringInTimeRepository } from '../../../src';

export class ConvertStringInTimeRepositoryMock
  implements ConvertStringInTimeRepository
{
  inputMock = '';
  convert(input: string): Date {
    this.inputMock = input;
    return new Date();
  }
}

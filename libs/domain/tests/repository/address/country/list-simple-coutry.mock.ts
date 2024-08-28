import {
  ListSimpleCountryDto,
  ListSimpleCountryRepository,
  ListSimpleCountryResponseDto,
} from '../../../../src';
import { listSimpleCountryMock } from '../../../entity';

export class ListSimpleCountryRepositoryMock
  implements ListSimpleCountryRepository
{
  inputMock = {} as ListSimpleCountryDto;
  async list(
    input: ListSimpleCountryDto
  ): Promise<ListSimpleCountryResponseDto[]> {
    this.inputMock = input;
    return [listSimpleCountryMock];
  }
}

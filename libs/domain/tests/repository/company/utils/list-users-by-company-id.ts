import {
  ListUsersByCompanyIdDto,
  ListUsersByCompanyIdRepository,
  ListUsersByCompanyResponseDto,
} from '../../../../src';
import { ListUsersByCompanyMock } from '../../../entity';

export class ListUsersByCompanyIdRepositoryMock
  implements ListUsersByCompanyIdRepository
{
  inputMock = {} as ListUsersByCompanyIdDto;
  async list(
    input: ListUsersByCompanyIdDto
  ): Promise<ListUsersByCompanyResponseDto> {
    this.inputMock = input;
    return ListUsersByCompanyMock;
  }
}

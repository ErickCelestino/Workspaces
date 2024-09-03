import {
  ListCompanyDto,
  ListCompanyRepository,
  ListCompanyResponseDto,
} from '../../../../src';
import { ListCompanyMock } from '../../../entity/company/list-company.mock';

export class ListCompanyRepositoryMock implements ListCompanyRepository {
  inputMock = {} as ListCompanyDto;
  async list(input: ListCompanyDto): Promise<ListCompanyResponseDto> {
    this.inputMock = input;
    return ListCompanyMock;
  }
}

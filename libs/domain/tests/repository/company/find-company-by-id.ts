import {
  CompanyDataResponseDto,
  FindCompanyByIdRepository,
} from '../../../src';
import { CompanyDataMock } from '../../entity/company/company-data.mock';

export class FindCompanyByIdRepositoryMock
  implements FindCompanyByIdRepository
{
  inputMock = '';
  async find(id: string): Promise<CompanyDataResponseDto> {
    this.inputMock = id;
    return CompanyDataMock;
  }
}

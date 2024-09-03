import {
  CompanyDataResponseDto,
  FindCompanyDataByIdRepository,
} from '../../../../src';
import { CompanyDataMock } from '../../../entity/company/company-data.mock';

export class FindCompanyDataByIdRepositoryMock
  implements FindCompanyDataByIdRepository
{
  inputMock = '';
  async find(id: string): Promise<CompanyDataResponseDto> {
    this.inputMock = id;
    return CompanyDataMock;
  }
}

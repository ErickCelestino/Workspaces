import {
  CompanyDataResponseDto,
  ConsultCompanyByCnpjRepository,
} from '../../../src';
import { CompanyDataMock } from '../../entity';

export class ConsultCompanyByCnpjRepositoryMock
  implements ConsultCompanyByCnpjRepository
{
  inputMock = '';
  async consult(cnpj: string): Promise<CompanyDataResponseDto> {
    this.inputMock = cnpj;
    return CompanyDataMock;
  }
}

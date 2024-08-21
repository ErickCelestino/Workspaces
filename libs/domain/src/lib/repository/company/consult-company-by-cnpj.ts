import { CompanyDataResponseDto } from '../../dto';

export interface ConsultCompanyByCnpjRepository {
  consult(cnpj: string): Promise<CompanyDataResponseDto>;
}

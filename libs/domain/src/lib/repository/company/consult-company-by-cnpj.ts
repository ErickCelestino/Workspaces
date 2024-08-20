import { CompanyDataDto } from '../../dto';

export interface ConsultCompanyByCnpjRepository {
  consult(cnpj: string): Promise<CompanyDataDto>;
}

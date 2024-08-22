import { CompanyDataResponseDto } from '../../dto';

export interface FindCompanyByIdRepository {
  find(id: string): Promise<CompanyDataResponseDto>;
}

import { CompanyResponseDto } from '../../../dto';

export interface FindCompanyByUserIdRepository {
  find(userId: string): Promise<CompanyResponseDto[]>;
}

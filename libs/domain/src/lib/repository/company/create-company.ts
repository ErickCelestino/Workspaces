import { CreateCompanyDto } from '../../dto';
import { ConsultCNPJResponse } from '../../entity';

export interface CreateCompanyRepository {
  create(
    inputDto: CreateCompanyDto,
    inputData: ConsultCNPJResponse
  ): Promise<void>;
}

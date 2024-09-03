import { CompanySimpleResponseDto, FindSimpleCompanyDto } from '../../../dto';

export interface FindSimpleCompanyByIdRepository {
  find(input: FindSimpleCompanyDto): Promise<CompanySimpleResponseDto>;
}

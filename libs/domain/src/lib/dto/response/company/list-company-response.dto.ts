import { companySimpleResponseDto } from './company-simple-response.dto';

export interface ListCompanyResponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  companies: companySimpleResponseDto[];
}

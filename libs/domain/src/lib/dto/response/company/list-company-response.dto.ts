import { ListSimpleCompanyResponseDto } from './list-simple-company-response.dto';

export interface ListCompanyResponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  companies: ListSimpleCompanyResponseDto[];
}

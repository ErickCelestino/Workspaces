import { ListCompanyResponseDto } from '../../../src';
import { CompanySimpleMock } from './company-simple.mock';

export const ListCompanyMock: ListCompanyResponseDto = {
  companies: [CompanySimpleMock],
  filteredTotal: 1,
  total: 1,
  totalPages: 1,
};

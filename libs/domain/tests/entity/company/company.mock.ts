import { CompanyResponseDto } from '../../../src';
import { CompanySimpleMock } from './company-simple.mock';
import { CompanyAddressMock } from './company-address.mock';
import { CompanyDataMock } from './company-data.mock';

export const CompanyMock: CompanyResponseDto = {
  data: CompanyDataMock,
  address: CompanyAddressMock,
  simple: CompanySimpleMock,
};

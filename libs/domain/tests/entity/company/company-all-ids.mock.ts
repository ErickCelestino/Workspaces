import { CompanyAllIdsResponseDto } from '../../../src';
import { CompanyAddressMock } from './company-address.mock';
import { CompanyDataMock } from './company-data.mock';
import { CompanyResponsibleMock } from './company-responsible.mock';
import { CompanySimpleMock } from './company-simple.mock';

export const companyAllIdsMock: CompanyAllIdsResponseDto = {
  companyAddressId: CompanyAddressMock.id,
  companyDataId: CompanyDataMock.id,
  companySimpleId: CompanySimpleMock.id,
  companyResponsibleId: CompanyResponsibleMock.id,
};

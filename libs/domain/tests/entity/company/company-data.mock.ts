import { faker } from '@faker-js/faker';
import { CompanyDataResponseDto } from '../../../src';
import { CompanyMock } from './company.mock';
import { CompanyAddressMock } from './company-address.mock';

export const CompanyDataMock: CompanyDataResponseDto = {
  legalNature: faker.lorem.word(),
  opening: faker.date.recent().toString(),
  phone: faker.phone.number(),
  port: faker.lorem.word(),
  situation: faker.lorem.word(),
  address: CompanyAddressMock,
  simple: CompanyMock,
};

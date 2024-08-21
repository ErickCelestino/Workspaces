import { faker } from '@faker-js/faker';
import { CompanyAddressResponseDto } from '../../../src';

export const CompanyAddressMock: CompanyAddressResponseDto = {
  city: faker.location.city(),
  country: faker.location.country(),
  district: faker.location.countryCode(),
  number: faker.number.int().toString(),
  state: faker.location.state(),
  street: faker.location.street(),
  zipcode: faker.location.zipCode(),
  complement: faker.lorem.word(),
};

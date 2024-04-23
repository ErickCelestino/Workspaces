import { faker } from '@faker-js/faker';
import { ConsultCNPJResponse } from '../../../../src';

export const ConsultCnpjMock: ConsultCNPJResponse = {
  opening: faker.string.alpha(3),
  district: faker.string.alpha(3),
  zipcode: faker.string.alpha(3),
  email: faker.internet.email(),
  street: faker.string.alpha(3),
  city: faker.string.alpha(3),
  legal_nature: faker.string.alpha(3),
  name: faker.string.alpha(3),
  number: faker.string.alpha(3),
  port: faker.string.alpha(3),
  situation: faker.string.alpha(3),
  telephone: faker.string.alpha(3),
  uf: faker.string.alpha(2),
};

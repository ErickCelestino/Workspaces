import { faker } from '@faker-js/faker';
import { CompanyDataDto } from '../../../src';

export const CompanyDataMock: CompanyDataDto = {
  port: faker.string.alpha(3),
  legalNature: faker.string.alpha(3),
  opening: faker.string.alpha(3),
  situation: faker.string.alpha(3),
};

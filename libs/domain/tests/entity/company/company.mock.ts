import { faker } from '@faker-js/faker';

export const companyMock = {
  id: faker.string.uuid(),
  name: faker.string.alpha(3),
  cnpj: '85863121000110',
};

import { faker } from '@faker-js/faker';
import { LoggedUser } from '../../../src';

export const LoggedUserMock: LoggedUser = {
  id: faker.string.uuid(),
  name: faker.string.alpha(3),
  email: faker.internet.email(),
  status: 'ACTIVE',
  type: 'ADMIN',
};

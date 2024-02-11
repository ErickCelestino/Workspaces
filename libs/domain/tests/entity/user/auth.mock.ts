import { Auth } from '../../../src';
import { faker } from '@faker-js/faker';

export const authMock: Auth = {
  auth_id: faker.string.uuid(),
  email: faker.internet.email(),
};

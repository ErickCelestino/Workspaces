import { faker } from '@faker-js/faker';
import { User } from '../../../src/lib/entity/user';

export const userMock: User = {
  id: faker.string.uuid(),
  email: faker.string.alpha(3),
  name: faker.string.alpha(3),
  nickname: faker.string.alpha(3),
};

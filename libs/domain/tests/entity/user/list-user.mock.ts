import { faker } from '@faker-js/faker';
import { UserList } from '../../../src';

export const listUserMock: UserList[] = [
  {
    userId: faker.string.uuid(),
    name: faker.string.alpha(3),
    nickname: faker.string.alpha(3),
    birthDate: faker.date.birthdate(),
    email: faker.internet.email(),
  },
  {
    userId: faker.string.uuid(),
    name: faker.string.alpha(3),
    nickname: faker.string.alpha(3),
    birthDate: faker.date.birthdate(),
    email: faker.internet.email(),
  },
];

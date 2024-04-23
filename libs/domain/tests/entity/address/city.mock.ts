import { faker } from '@faker-js/faker';
import { City } from '../../../src';

export const CityMock: City = {
  city_id: faker.string.uuid(),
  name: faker.string.alpha(3),
};

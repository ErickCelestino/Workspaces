import { faker } from '@faker-js/faker';
import { ListSchedulingReponseDto } from '../../../src';
import { SchedulingMock } from './scheduling.mock';

export const ListSchedulingReponseMock: ListSchedulingReponseDto = {
  scheduling: [SchedulingMock],
  filteredTotal: parseInt(`${faker.number.bigInt}`),
  total: parseInt(`${faker.number.bigInt}`),
  totalPages: parseInt(`${faker.number.bigInt}`),
};

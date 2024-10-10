import { UploadedFile } from '../../../src';
import { faker } from '@faker-js/faker';

export const UploadContentFileMock: UploadedFile = {
  buffer: {} as Buffer,
  encoding: faker.string.alpha(),
  fieldname: faker.string.alpha(),
  filename: faker.string.alpha(),
  mimetype: faker.string.alpha(),
  originalname: faker.string.alpha(),
  path: faker.string.alpha(),
  size: faker.number.int(),
};

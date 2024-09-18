import { ListUsersByCompanyResponseDto } from '../../../../src';
import { listUserMock } from '../../../entity';

export const ListUsersByCompanyMock: ListUsersByCompanyResponseDto = {
  filteredTotal: 1,
  total: 1,
  totalPages: 1,
  users: listUserMock,
};

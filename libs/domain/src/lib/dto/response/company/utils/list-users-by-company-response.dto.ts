import { UserList } from '@workspaces/domain';

export interface ListUsersByCompanyResponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  users: UserList[];
}

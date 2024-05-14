import {
  CreateUserDto,
  CreateUserResponse,
  ListUserDto,
  UserList,
} from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function ListUserRequest(input: string) {
  const result = await generalApi.get<UserList>('list-user', {
    params: {
      filter: input,
    },
  });
  return result.data;
}

import { CreateUserDto, CreateUserResponse } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function ListUserRequest(input: CreateUserDto) {
  const resultId = await generalApi.post<CreateUserResponse>(
    'create-user',
    input
  );
  return resultId.data.user_id;
}

import { CreateUserDto, CreateUserResponseDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function CreateUserRequest(input: CreateUserDto) {
  const resultId = await generalApi.post<CreateUserResponseDto>(
    'create-user',
    input
  );
  return resultId.data.user_id;
}

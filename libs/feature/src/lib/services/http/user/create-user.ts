import { CreateUserDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function CreateUserRequest(input: CreateUserDto): Promise<string> {
  const request = await generalApi.post('create-user', input);
  return request.data;
}

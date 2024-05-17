import { EditUserDto } from '@workspaces/domain';
import { generalApi } from '../axios-config';

export async function EditUserRequest(input: EditUserDto) {
  const resultId = await generalApi.put('edit-user', input);
  return resultId.data;
}
